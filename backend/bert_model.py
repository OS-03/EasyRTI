import logging  # Add logging module
from fastapi import FastAPI, HTTPException, UploadFile, File
import numpy as np
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import torch
from torch.nn.functional import softmax
from transformers import AutoModelForSequenceClassification, AutoTokenizer, MBartForConditionalGeneration, MBartTokenizer
from transformers.utils import logging as transformers_logging  # Rename to avoid conflict
import importlib
from ultralytics import YOLO
from huggingface_hub import hf_hub_download
from supervision import Detections # Correct import for YOLO
import os
from PIL import Image
import io
import sys
import cv2  # Add OpenCV for image processing
import pytesseract  # Add Tesseract for OCR
import re  # Add regex for text cleaning
import sentencepiece

# Configure logging
logging.basicConfig(level=logging.WARNING)  # Set logging to WARNING to reduce verbosity
logger = logging.getLogger(__name__)


# Configure transformers logging
transformers_logging.set_verbosity_info()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Explicitly allow the frontend origin
    allow_credentials=True,  # Allow credentials (cookies, HTTP authentication)
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Define the label-to-department mapping
label_to_department = {
    0: "Agriculture",
    1: "Education",
    2: "Election Commission",
    3: "Environment",
    4: "Finance",
    5: "Health",
    6: "Housing",
    7: "Transport"
}

try:
    # Load classifier model and tokenizer
    classifier_model_name = "conan04/bert_rti_multilingual"
    classifier_tokenizer = AutoTokenizer.from_pretrained(classifier_model_name)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    classifier_model = AutoModelForSequenceClassification.from_pretrained(classifier_model_name).to(device)

    # Warm-up classifier model
    dummy_input = classifier_tokenizer("Warm-up", return_tensors="pt", truncation=True, padding=True, max_length=512).to(device)
    classifier_model(**dummy_input)

    # Load summarizer model
    summarizer_model_name = "conan04/mbart_request_summarizer2"
    summarizer_model = MBartForConditionalGeneration.from_pretrained(summarizer_model_name).to(device)
    summarizer_tokenizer = MBartTokenizer.from_pretrained(summarizer_model_name)
    dummy_input = summarizer_tokenizer("Warm-up", return_tensors="pt", truncation=True, padding=True, max_length=512).to(device)
    summarizer_model.generate(dummy_input["input_ids"], attention_mask=dummy_input["attention_mask"], max_length=50)

    # Load YOLO model
    repo_config = dict(
        repo_id="arnabdhar/YOLOv8-nano-aadhar-card",
        filename="model.pt",
        local_dir="./models"
    )
    model_path = hf_hub_download(**repo_config)
    aadhaar_model = YOLO(model_path)
    id2label = aadhaar_model.names

except Exception as e:
    logger.error(f"Error during application initialization: {e}")
    raise

class RTIRequest(BaseModel):
    text: str

@app.post("/classify")
async def classify_request(request: RTIRequest):
    try:
        inputs = classifier_tokenizer(request.text, return_tensors="pt", truncation=True, padding=True, max_length=256).to(device)
        outputs = classifier_model(**inputs)
        logits = outputs.logits
        probs = softmax(logits, dim=1)
        predicted_class_index = torch.argmax(probs, dim=1).item()
        department_name = label_to_department.get(predicted_class_index, "Unknown")
        confidence = torch.max(probs).item()
        return {"department": department_name, "confidence": round(confidence, 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Classification failed.")

@app.post("/summarize")
async def summarize_request(request: RTIRequest):
    try:
        inputs = summarizer_tokenizer(request.text, return_tensors="pt", truncation=True, padding=True, max_length=256).to(device)
        summary_ids = summarizer_model.generate(inputs["input_ids"], attention_mask=inputs["attention_mask"], max_length=100, num_beams=4, early_stopping=True)
        summary = summarizer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return {"generated_summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Summarization failed.")

@app.post("/text-summarize-response")
async def text_summarize_response(request: RTIRequest):
    try:
        # Tokenize the input text for summarization
        inputs = summarizer_tokenizer(
            request.text, return_tensors="pt", truncation=True, padding=True, max_length=256
        ).to(device)

        # Generate the summary
        summary_ids = summarizer_model.generate(
            inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_length=100,  # Adjust based on desired summary length
            num_beams=4,
            early_stopping=True
        )

        # Decode the generated summary
        summary = summarizer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return {"generated_response_summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def clean_text(text):
    """Clean up the extracted text by removing unwanted characters and extra spaces."""
    text = re.sub(r"[^a-zA-Z0-9\s:/,-]", "", text)  # Remove special characters
    text = re.sub(r"\s+", " ", text).strip()  # Replace multiple spaces with a single space
    return text

def extract_date_of_birth(text):
    """Extract date of birth using regex."""
    match = re.search(r"\b\d{2}/\d{2}/\d{4}\b", text)  # Match date in DD/MM/YYYY format
    return match.group(0) if match else "Not found"

def extract_gender(text):
    """Extract gender from the text."""
    if "male" in text.lower():
        return "Male"
    elif "female" in text.lower():
        return "Female"
    else:
        return "Not found"

def extract_name(text):
    """Extract name from the text."""
    # Assume the name is the first proper noun or sequence of words before 'Male' or 'Female'
    match = re.search(r"([A-Z][a-z]+(?: [A-Z][a-z]+)*)(?= Male| Female|$)", text)
    return match.group(0) if match else "Not found"

def refine_gender_extraction(text):
    """Refine gender extraction to avoid including irrelevant text."""
    return extract_gender(text)  # Reuse the existing gender extraction logic

@app.post("/extract-aadhaar")
async def extract_aadhaar(aadhaar: UploadFile = File(...)):
    try:
        temp_file_path = f"temp_{aadhaar.filename}"
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(await aadhaar.read())

        predictions = aadhaar_model.predict(temp_file_path)
        if not predictions:
            raise ValueError("No predictions were made by the YOLO model.")

        id2label = {
            0: "AADHAR_NUMBER",
            1: "DATE_OF_BIRTH",
            2: "GENDER",
            3: "NAME",
            4: "ADDRESS"
        }
        extracted_data = {label: [] for label in id2label.values()}
        image = cv2.imread(temp_file_path)

        for result in predictions:
            if hasattr(result, "boxes") and result.boxes is not None:
                for box, cls in zip(result.boxes.xyxy.cpu().numpy(), result.boxes.cls.cpu().numpy()):
                    x_min, y_min, x_max, y_max = map(int, box[:4])
                    label = id2label.get(int(cls), "UNKNOWN")
                    cropped_image = image[y_min:y_max, x_min:x_max]
                    gray_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
                    threshold_image = cv2.adaptiveThreshold(
                        gray_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
                    )
                    raw_text = pytesseract.image_to_string(threshold_image, lang="eng").strip()
                    cleaned_text = clean_text(raw_text)
                    if label == "DATE_OF_BIRTH":
                        extracted_data[label].append(extract_date_of_birth(cleaned_text))
                    elif label == "GENDER":
                        extracted_data[label].append(refine_gender_extraction(cleaned_text))
                    elif label == "NAME":
                        extracted_data[label].append(extract_name(cleaned_text))
                    else:
                        extracted_data[label].append(cleaned_text)

        for label in extracted_data.keys():
            if not extracted_data[label]:
                fallback_text = pytesseract.image_to_string(image, lang="eng").strip()
                cleaned_fallback_text = clean_text(fallback_text)
                if label == "DATE_OF_BIRTH":
                    extracted_data[label] = [extract_date_of_birth(cleaned_fallback_text)]
                elif label == "GENDER":
                    extracted_data[label] = [refine_gender_extraction(cleaned_fallback_text)]
                elif label == "NAME":
                    extracted_data[label] = [extract_name(cleaned_fallback_text)]
                else:
                    extracted_data[label] = [cleaned_fallback_text]

        for label, values in extracted_data.items():
            extracted_data[label] = " | ".join(values) if values else "Not found"

        os.remove(temp_file_path)
        return {"success": True, "data": extracted_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to process Aadhaar card.")
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
