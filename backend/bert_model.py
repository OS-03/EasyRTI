from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import torch
from torch.nn.functional import softmax
from transformers import AutoModelForSequenceClassification, AutoTokenizer, MBartForConditionalGeneration, MBartTokenizer
from ultralytics import YOLO
from huggingface_hub import hf_hub_download
import os
from PIL import Image
import cv2
import pytesseract
import re

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://easyrti-frontend.onrender.com/"],  # Explicitly allow the frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

# Load models and tokenizers
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
classifier_model_name = "conan04/bert_rti_multilingual"
classifier_tokenizer = AutoTokenizer.from_pretrained(classifier_model_name)
classifier_model = AutoModelForSequenceClassification.from_pretrained(classifier_model_name).to(device)

summarizer_model_name = "conan04/mbart_request_summarizer2"
summarizer_model = MBartForConditionalGeneration.from_pretrained(summarizer_model_name).to(device)
summarizer_tokenizer = MBartTokenizer.from_pretrained(summarizer_model_name)

repo_config = dict(
    repo_id="arnabdhar/YOLOv8-nano-aadhar-card",
    filename="model.pt",
    local_dir="./models"
)
model_path = hf_hub_download(**repo_config)
aadhaar_model = YOLO(model_path)

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
    except Exception:
        raise HTTPException(status_code=500, detail="Classification failed.")

@app.post("/summarize")
async def summarize_request(request: RTIRequest):
    try:
        inputs = summarizer_tokenizer(request.text, return_tensors="pt", truncation=True, padding=True, max_length=256).to(device)
        summary_ids = summarizer_model.generate(inputs["input_ids"], attention_mask=inputs["attention_mask"], max_length=100, num_beams=4, early_stopping=True)
        summary = summarizer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return {"generated_summary": summary}
    except Exception:
        raise HTTPException(status_code=500, detail="Summarization failed.")

def clean_text(text):
    """Clean up the extracted text by removing unwanted characters and extra spaces."""
    text = re.sub(r"[^a-zA-Z0-9\s:/,-]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def extract_date_of_birth(text):
    """Extract date of birth using regex."""
    match = re.search(r"\b\d{2}/\d{2}/\d{4}\b", text)
    return match.group(0) if match else "Not found"

def extract_gender(text):
    """Extract gender from the text."""
    if "male" in text.lower():
        return "Male"
    elif "female" in text.lower():
        return "Female"
    return "Not found"

def extract_name(text):
    """Extract name from the text."""
    match = re.search(r"([A-Z][a-z]+(?: [A-Z][a-z]+)*)(?= Male| Female|$)", text)
    return match.group(0) if match else "Not found"

@app.post("/extract-aadhaar")
async def extract_aadhaar(aadhaar: UploadFile = File(...)):
    temp_file_path = f"temp_{aadhaar.filename}"
    try:
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
                        extracted_data[label].append(extract_gender(cleaned_text))
                    elif label == "NAME":
                        extracted_data[label].append(extract_name(cleaned_text))
                    else:
                        extracted_data[label].append(cleaned_text)

        for label, values in extracted_data.items():
            extracted_data[label] = " | ".join(values) if values else "Not found"

        return {"success": True, "data": extracted_data}
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to process Aadhaar card.")
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
