# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from transformers import AutoTokenizer, AutoModelForSequenceClassification
# import torch

# app = FastAPI(title="Fake News Detector API")

# # Load model and tokenizer at startup
# MODEL_ID = "patilsom/FakeNewsDetector-Hindi-English"
# tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
# model = AutoModelForSequenceClassification.from_pretrained(MODEL_ID)
# model.eval()  # Set model to eval mode



# # Map model output indices to labels
# CLASS_MAPPING = {0: "Real", 1: "Fake"}

# class Item(BaseModel):
#     text: str

# @app.post("/predict")
# def predict_news(item: Item):
#     if not item.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")

#     try:

#         # Tokenize input
#         inputs = tokenizer(
#             item.text,
#             return_tensors="pt",
#             padding=True,
#             truncation=True,
#             max_length=512
#         )

#         # Model inference
#         with torch.no_grad():
#             outputs = model(**inputs)
#             probs = torch.softmax(outputs.logits, dim=1)[0]

#         # Get probabilities
#         real_prob = float(probs[0])
#         fake_prob = float(probs[1])

#         # Determine label
#         label = "Fake" if fake_prob > real_prob else "Real"

#         return {
#             "label": label,
#             "real_prob": real_prob,
#             "fake_prob": fake_prob
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")





# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from transformers import AutoTokenizer, AutoModelForSequenceClassification
# import torch
# import pandas as pd
# import os

# app = FastAPI(title="Fake News Detector API")

# # --------------------------
# # LOAD MODEL
# # --------------------------
# MODEL_ID = "patilsom/FakeNewsDetector-Hindi-English"

# try:
#     tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
#     model = AutoModelForSequenceClassification.from_pretrained(MODEL_ID)
#     model.eval()
# except Exception as e:
#     print("❌ MODEL LOADING FAILED:", e)

# # --------------------------
# # LOAD CSV DATASET
# # --------------------------

# CSV_FILE = "WELFake_Dataset.csv"

# if not os.path.exists(CSV_FILE):
#     print(f"❌ CSV FILE NOT FOUND: {CSV_FILE}")
#     train_text_set = set()
# else:
#     train_df = pd.read_csv(CSV_FILE)
#     train_text_set = set(train_df["text"].str.lower().tolist())
#     print(f"✅ CSV Loaded : {len(train_text_set)} texts")

# # --------------------------
# # REQUEST BODY
# # --------------------------
# class Item(BaseModel):
#     text: str


# # --------------------------
# # CLASSIFICATION FUNCTION
# # --------------------------
# def classify_text(text: str):

#     cleaned_text = text.lower().strip()

#     # Out-of-dataset logic
#     if cleaned_text not in train_text_set:
#         return {
#             "label": "REAL",
#             "source": "OUT_OF_DATASET"
#         }

#     # Tokenize input
#     inputs = tokenizer(
#         text,
#         return_tensors="pt",
#         padding=True,
#         truncation=True,
#         max_length=512
#     )

#     # Inference
#     with torch.no_grad():
#         outputs = model(**inputs)
#         probs = torch.softmax(outputs.logits, dim=1)[0]

#     real_prob = float(probs[0])
#     fake_prob = float(probs[1])

#     label = "Fake" if fake_prob > real_prob else "Real"

#     return {
#         "label": label,
#         "real_prob": real_prob,
#         "fake_prob": fake_prob,
#         "source": "MODEL"
#     }


# # --------------------------
# # API ENDPOINT
# # --------------------------
# @app.post("/predict")
# def predict_news(item: Item):
#     if not item.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")

#     try:
#         return classify_text(item.text)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")



# from fastapi import FastAPI
# from pydantic import BaseModel
# from transformers import BertTokenizer, BertForSequenceClassification
# import torch
# import pandas as pd

# # ====== FASTAPI APP ======
# app = FastAPI()

# # ====== MODEL LOADING ======
# MODEL_NAME = "patilsom/fake-news-detector-model"

# tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)
# model = BertForSequenceClassification.from_pretrained(MODEL_NAME)

# # ====== LOAD DATASET ======
# train_df = pd.read_csv("fake_news_final.csv")
# train_text_set = set(train_df["text"].str.lower().tolist())

# # ====== CUSTOM FUNCTION ======
# def classify_text(text):
#     txt = text.lower().strip()

#     if txt not in train_text_set:
#         return {
#             "label": "REAL",
#             "source": "Out-of-Dataset"
#         }

#     inputs = tokenizer(
#         text,
#         return_tensors="pt",
#         truncation=True,
#         padding="max_length",
#         max_length=256
#     )
    
#     outputs = model(**inputs)
#     pred = torch.argmax(outputs.logits, dim=1).item()
#     label = "FAKE" if pred == 0 else "REAL"

#     return {
#         "label": label,
#         "source": "Model Prediction"
#     }

# # ====== REQUEST MODEL ======
# class TextInput(BaseModel):
#     text: str

# # ====== API ENDPOINT ======
# @app.post("/predict")
# def predict(data: TextInput):
#     return classify_text(data.text)

# from fastapi import FastAPI
# from pydantic import BaseModel
# from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

# # Load model from Hugging Face
# MODEL_NAME = "patilsom/fake-news-classifier-title"

# tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
# model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

# pipe = pipeline(
#     "text-classification",
#     model=model,
#     tokenizer=tokenizer,
#     return_all_scores=True
# )

# app = FastAPI(title="Fake News Detector")

# # Request body
# class NewsInput(BaseModel):
#     text: str

# @app.get("/")
# def home():
#     return {"msg": "Fake News Classifier LIVE"}

# @app.post("/predict")
# def predict(data: NewsInput):
#     result = pipe(data.text)[0]

#     # Extract scores
#     label0 = result[0]["score"]  # Real?
#     label1 = result[1]["score"]  # Fake?

#     final_label = "FAKE" if label1 > label0 else "REAL"

#     return {
#         "input": data.text,
#         "prediction": final_label,
#         "scores": {
#             "real": float(label0),
#             "fake": float(label1)
#         }
#     }
# service.py


from fastapi import FastAPI
from pydantic import BaseModel
from huggingface_hub import hf_hub_download
import pickle, json
from fastapi.middleware.cors import CORSMiddleware

# 1️⃣ Single app
app = FastAPI()


origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173"   # agar zarurat ho
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3️⃣ Load model
REPO_ID = "patilsom/title-classifier-model"
model_path = hf_hub_download(repo_id=REPO_ID, filename="title_classifier.pkl")
existing_titles_path = hf_hub_download(repo_id=REPO_ID, filename="existing_titles.json")

model = pickle.load(open(model_path, "rb"))
existing_titles = set(json.load(open(existing_titles_path)))

# 4️⃣ Input format
class InputText(BaseModel):
    title: str

# 5️⃣ Routes
@app.post("/predict")
def predict(data: InputText):
    title = data.title.strip()
    if title not in existing_titles:
        return {"label": "Real"}
    label = model.predict([title])[0]
    return {"label": label}

@app.get("/")
def home():
    return {"message": "Fake News Classifier API is running!"}
