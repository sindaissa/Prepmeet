import cv2
import numpy as np
import mediapipe as mp
from tensorflow.keras.models import load_model
from collections import deque
from datetime import datetime
import json
import os

# === Partie 1 : Capture Vidéo et Analyse Comportementale ===

# Modèle d’émotion
model = load_model('fer2013_mini_XCEPTION.119-0.65.hdf5', compile=False)
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Initialisation MediaPipe
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
movement_threshold = 30
history = deque(maxlen=5)
vol = 0.5

# Détecteur de visage OpenCV
face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Webcam
cap = cv2.VideoCapture(0)
log_history = []

with mp_hands.Hands(max_num_hands=2, min_detection_confidence=0.7, min_tracking_confidence=0.7) as hands:
    previous_positions = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        timestamp = datetime.now().isoformat()
        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Détection du visage + émotions
        faces = face_classifier.detectMultiScale(gray, 1.3, 5)
        detected_emotion = "None"
        emotion_confidence = 0.0

        for (x, y, w, h) in faces:
            roi_gray = gray[y:y+h, x:x+w]
            roi_gray = cv2.resize(roi_gray, (48, 48))
            roi = roi_gray.astype('float') / 255.0
            roi = np.expand_dims(roi, axis=-1)
            roi = np.expand_dims(roi, axis=0)

            preds = model.predict(roi, verbose=0)[0]
            detected_emotion = emotion_labels[np.argmax(preds)]
            emotion_confidence = np.max(preds)

            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, f"{detected_emotion} ({emotion_confidence:.2f})", (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 255), 2)

        # Détection des mains
        current_positions = []
        result = hands.process(rgb_frame)
        if result.multi_hand_landmarks:
            for hand_landmarks in result.multi_hand_landmarks:
                for id, lm in enumerate(hand_landmarks.landmark):
                    h, w, _ = frame.shape
                    cx, cy = int(lm.x * w), int(lm.y * h)
                    current_positions.append((cx, cy))
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        # Lissage du mouvement
        history.append(current_positions)
        if len(history) == 5 and all(len(h) == len(current_positions) for h in history):
            smoothed_positions = []
            for i in range(len(current_positions)):
                avg_x = sum([h[i][0] for h in history]) / len(history)
                avg_y = sum([h[i][1] for h in history]) / len(history)
                smoothed_positions.append((avg_x, avg_y))
        else:
            smoothed_positions = current_positions

        # Calcul de l'intensité du mouvement
        if previous_positions and len(smoothed_positions) == len(previous_positions):
            movement = sum([abs(curr[0] - prev[0]) + abs(curr[1] - prev[1])
                            for curr, prev in zip(smoothed_positions, previous_positions)])
        else:
            movement = 0

        if len(current_positions) == 0:
            movement_status = "No Hands"
            vol = max(0.0, vol - 0.02)
        elif movement > movement_threshold:
            movement_status = "High"
            vol = min(1.0, vol + 0.02)
        else:
            movement_status = "Low"
            vol = max(0.0, vol - 0.01)

        previous_positions = smoothed_positions

        # Affichage du volume
        cv2.rectangle(frame, (50, 50), (80, 300), (255, 255, 255), 2)
        vol_height = int(250 * vol)
        cv2.rectangle(frame, (55, 300 - vol_height), (75, 300), (0, 255, 0), -1)
        cv2.putText(frame, f'Volume: {int(vol * 100)}%', (50, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        # Logging
        log_entry = {
            "timestamp": timestamp,
            "emotion": detected_emotion,
            "confidence": float(emotion_confidence),
            "movement_status": movement_status,
            "volume": round(vol, 2)
        }
        log_history.append(log_entry)

        # Affichage vidéo
        cv2.imshow("Comportement Emotion & Gestes", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()

# Sauvegarde des logs
os.makedirs("logs", exist_ok=True)
with open("logs/session_log.json", "w") as f:
    json.dump(log_history, f, indent=4)

# === Partie 2 : Analyse LLM avec LangGraph et Gemini ===

from langgraph.graph import StateGraph
from langchain_core.runnables import RunnableLambda
from typing import TypedDict
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

os.environ["GOOGLE_API_KEY"] = "AIzaSyAMzr-cfBmVYZdUoyheDPlv3VcSCOHAUq0"  # à sécuriser dans un .env

class AppState(TypedDict):
    logs: dict
    analysis: str

def load_session_data():
    with open("logs/session_log.json", "r") as f:
        return json.load(f)

def build_prompt(log_data):
    prompt = (
        "Tu es un expert en analyse comportementale assistée par l'IA.\n\n"
        "Contexte : Je suis en réunion avec un client professionnel. Mon objectif est de faire bonne impression, "
        "d'établir une relation de confiance, de rester calme et professionnel, et de bien gérer mon langage corporel.\n\n"
        "Voici les données issues d'une session vidéo capturée par caméra : elles contiennent la détection de mes émotions faciales, "
        "mes mouvements de mains (et leur intensité), et le niveau d'agitation estimé.\n\n"
        "Analyse ces données pour identifier :\n"
        "- Les émotions dominantes ressenties pendant la réunion.\n"
        "- Les changements d'humeur significatifs.\n"
        "- Le lien entre mes mouvements de main et mes émotions (ex. agitation, nervosité, confiance).\n\n"
        "Ensuite, donne-moi des recommandations personnalisées pour :\n"
        "- Améliorer ma posture et ma gestuelle lors d'une réunion professionnelle.\n"
        "- Mieux gérer mes émotions visibles (ex. stress, frustration).\n"
        "- Renforcer la perception de professionnalisme et de confiance lors des échanges avec un client.\n\n"
        f"Données comportementales analysées :\n{json.dumps(log_data, indent=2)}"
    )
    return prompt

def query_gemini_agent(prompt):
    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.6)
    response = model.invoke([HumanMessage(content=prompt)])
    return response.content

def analyze_behavior(state):
    logs = state["logs"]
    prompt = build_prompt(logs)
    summary = query_gemini_agent(prompt)
    return {"analysis": summary}

def run_langgraph_analysis():
    logs = load_session_data()
    initial_state = {"logs": logs}
    graph = StateGraph(AppState)
    graph.add_node("analyze_behavior", analyze_behavior)
    graph.set_entry_point("analyze_behavior")
    graph.set_finish_point("analyze_behavior")
    compiled_graph = graph.compile()
    result = compiled_graph.invoke(initial_state)
    return result["analysis"]

# Lancement automatique de l’analyse après la session
print("📊 Lancement de l’analyse comportementale avec Gemini...")
analysis = run_langgraph_analysis()

with open("logs/llm_analysis.txt", "w", encoding="utf-8") as f:
    f.write(analysis)

print("✅ Analyse générée par Gemini Flash :\n")
print(analysis)
