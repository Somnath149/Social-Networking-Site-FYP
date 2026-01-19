from fastapi import FastAPI
from pydantic import BaseModel
from huggingface_hub import hf_hub_download
import pickle, json
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:5173"  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REPO_ID = "patilsom/title-classifier-model"
model_path = hf_hub_download(repo_id=REPO_ID, filename="title_classifier.pkl")
existing_titles_path = hf_hub_download(repo_id=REPO_ID, filename="existing_titles.json")

model = pickle.load(open(model_path, "rb"))
existing_titles = set(json.load(open(existing_titles_path)))

class InputText(BaseModel):
    title: str

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
