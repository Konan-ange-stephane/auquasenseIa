from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import numpy as np
import io
import requests
import os
import cv2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyser-image/")
async def analyser_image(file: UploadFile = File(...)):
    contents = await file.read()
    analyse = detect_water_state_opencv(contents)
    niveau = detect_water_level_opencv(contents)
    return {"analyse": analyse, "niveau_eau": f"{niveau}% de la surface de l'image est de l'eau" if niveau is not None else "Niveau d'eau non détecté"}

API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyBUmeAWE4dnmlkXIwUbURiLJgcseWkS9RE")  # de préférence dans une variable d'env

class PromptRequest(BaseModel):
    prompt: str

@app.post("/gemini/")
async def gemini_query(request: PromptRequest):
    prompt = request.prompt

    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key={API_KEY}"


    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        return {"error": str(e), "details": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyser-image-et-explique/")
async def analyser_image_et_explique(file: UploadFile = File(...)):
    contents = await file.read()
    analyse = detect_water_state_opencv(contents)
    niveau = detect_water_level_opencv(contents)
    prompt = (
        f"Voici un diagnostic sur l'état d'une eau naturelle : {analyse}.\n"
        f"Le niveau d'eau détecté est : {niveau}% de la surface de l'image.\n"
        "1. Explique ce diagnostic de façon simple et compréhensible pour un enfant.\n"
        "2. Donne ensuite des conseils pratiques ou des mesures à prendre pour garantir la sécurité de l'eau, adaptés à ce diagnostic."
    )

    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key={API_KEY}"
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        gemini_response = response.json()
        return {
            "analyse": analyse,
            "niveau_eau": f"{niveau}% de la surface de l'image est de l'eau" if niveau is not None else "Niveau d'eau non détecté",
            "explication": gemini_response
        }
    except requests.exceptions.HTTPError as e:
        return {"error": str(e), "details": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def detect_water_state_opencv(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return "Erreur : Impossible de décoder l'image. Format non supporté ou image corrompue."
    img = cv2.resize(img, (100, 100))
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    avg_hue = float(hsv[:, :, 0].mean())
    avg_sat = float(hsv[:, :, 1].mean())
    avg_val = float(hsv[:, :, 2].mean())

    # Eau claire (bleue ou transparente, forte luminosité)
    if avg_val > 160 and 80 < avg_hue < 130 and avg_sat < 80:
        return "✅ Sûr : Eau claire détectée."
    # Eau avec algues (vert, saturation forte)
    elif 35 < avg_hue < 90 and avg_sat > 70:
        return "❌ Danger : Présence probable d'algues (eau verte)."
    # Eau trouble/brune (hue orangé/rouge, saturation moyenne à forte)
    elif 5 < avg_hue < 30 and avg_sat > 60:
        return "⚠️ Avertissement : Eau trouble ou coloration brune/rougeâtre détectée."
    # Sécheresse (faible luminosité, peu d'eau visible)
    elif avg_val < 60:
        return "⚠️ Avertissement : Niveau d'eau très bas ou sécheresse possible."
    # Eau très sombre (pollution ou ombre forte)
    elif avg_val < 100 and avg_sat < 40:
        return "⚠️ Avertissement : Eau très sombre, possible pollution ou ombre importante."
    else:
        return "ℹ️ Eau d'apparence normale, aucun signe particulier détecté."

def detect_water_level_opencv(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return None
    img = cv2.resize(img, (100, 100))
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    # Masque pour l'eau (bleu/vert)
    lower_blue = np.array([80, 30, 40])
    upper_blue = np.array([130, 255, 255])
    mask_blue = cv2.inRange(hsv, lower_blue, upper_blue)
    lower_green = np.array([35, 30, 40])
    upper_green = np.array([90, 255, 255])
    mask_green = cv2.inRange(hsv, lower_green, upper_green)
    mask = cv2.bitwise_or(mask_blue, mask_green)
    water_pixels = cv2.countNonZero(mask)
    total_pixels = img.shape[0] * img.shape[1]
    water_level_percent = (water_pixels / total_pixels) * 100
    return round(water_level_percent, 2)

@app.post("/analyser-image-opencv/")
async def analyser_image_opencv(file: UploadFile = File(...)):
    contents = await file.read()
    analyse = detect_water_state_opencv(contents)
    niveau = detect_water_level_opencv(contents)
    return {"analyse": analyse, "niveau_eau": f"{niveau}% de la surface de l'image est de l'eau" if niveau is not None else "Niveau d'eau non détecté"}
