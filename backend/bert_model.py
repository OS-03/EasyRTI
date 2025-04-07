from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
# Removed unused import: pipeline
from fastapi.middleware.cors import CORSMiddleware
import torch
from torch.nn.functional import softmax
from transformers import AutoModelForSequenceClassification, AutoTokenizer, MBartForConditionalGeneration, MBartTokenizer
from transformers.utils import logging  # type: ignore
import importlib

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin
    allow_credentials=True,
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
# Load classifier model and tokenizer
classifier_model_name = "conan04/bert_rti_multilingual"
classifier_tokenizer = AutoTokenizer.from_pretrained(classifier_model_name)

# Ensure compatibility with available devices
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
classifier_model = AutoModelForSequenceClassification.from_pretrained(classifier_model_name).to(device)

# Check if sentencepiece is installed
if importlib.util.find_spec("sentencepiece") is None:
    raise ImportError(
        "The SentencePiece library is required but not installed. "
        "Please install it using 'pip install sentencepiece' and restart the application."
    )

# Load summarizer model and tokenizer
summarizer_model_name = "conan04/mbart_request_summarizer2"
summarizer_model = MBartForConditionalGeneration.from_pretrained(summarizer_model_name).to(device)
summarizer_tokenizer = MBartTokenizer.from_pretrained(summarizer_model_name)

class RTIRequest(BaseModel):
    text: str

@app.post("/classify")
async def classify_request(request: RTIRequest):
    try:
        # Tokenize the text for classification
        inputs = classifier_tokenizer(
            request.text, return_tensors="pt", truncation=True, padding=True, max_length=512
        ).to(device)

        # Perform inference
        outputs = classifier_model(**inputs)

        # Get logits and apply softmax
        logits = outputs.logits
        probs = softmax(logits, dim=1)

        # Get the predicted class index
        predicted_class_index = torch.argmax(probs, dim=1).item()

        # Get the predicted label
        department_name = label_to_department.get(predicted_class_index, "Unknown")
        confidence = torch.max(probs).item()
        return {"department": department_name, "confidence": round(confidence, 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize")
async def summarize_request(request: RTIRequest):
    try:
        # Tokenize the input text for summarization
        inputs = summarizer_tokenizer(
            request.text, return_tensors="pt", truncation=True, padding=True, max_length=512
        ).to(device)

        # Generate the summary
        summary_ids = summarizer_model.generate(
            inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_length=150,  # Adjust based on desired summary length
            num_beams=4,
            early_stopping=True
        )

        # Decode the generated summary
        summary = summarizer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return {"generated_summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/text-summarize-response")
async def text_summarize_response(request: RTIRequest):
    try:
        # Tokenize the input text for summarization
        inputs = summarizer_tokenizer(
            request.text, return_tensors="pt", truncation=True, padding=True, max_length=512
        ).to(device)

        # Generate the summary
        summary_ids = summarizer_model.generate(
            inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_length=150,  # Adjust based on desired summary length
            num_beams=4,
            early_stopping=True
        )

        # Decode the generated summary
        summary = summarizer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return {"generated_response_summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sample-requests")
async def get_sample_requests():
    sample_requests = {
        "Agriculture": "What are the government schemes available for farmers in my region?",
        "Education": "Please provide details about the budget allocation for primary education in my district.",
        "Election Commission": "How many polling stations were set up in the last general election in my constituency?",
        "Environment": "What steps are being taken to reduce air pollution in my city?",
        "Finance": "What is the total expenditure of the government on public welfare schemes this year?",
        "Health": "How many hospitals are operational in my district and their facilities?",
        "Housing": "What are the eligibility criteria for government housing schemes?",
        "Transport": "What is the status of the metro rail project in my city?"
    }
    return sample_requests
