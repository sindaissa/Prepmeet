import google.generativeai as genai
import evaluate
import bert_score

# ====== CONFIGURATION ======
API_KEY = "AIzaSyAMzr-cfBmVYZdUoyheDPlv3VcSCOHAUq0"  
QUESTION = "Réponds en une seule phrase : Quelles sont les composants du sang ?"
REFERENCE = "Le sang est composé de globules rouges, de globules blancs, de plaquettes et de plasma."

# ====== INITIALISATION GEMINI ======
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# ====== GÉNÉRATION ======
response = model.generate_content(QUESTION)
generated = response.text.strip()
print("=== Réponse de Gemini ===\n", generated)

# ====== MÉTRIQUES ======
bleu = evaluate.load("bleu")
rouge = evaluate.load("rouge")

bleu_score = bleu.compute(predictions=[generated], references=[[REFERENCE]])
rouge_score = rouge.compute(predictions=[generated], references=[REFERENCE])

# BERTScore via score()
P, R, F1 = bert_score.score([generated], [REFERENCE], lang="fr")

# ====== AFFICHAGE ======
print("\n=== Scores ===")
print(f"BLEU: {bleu_score['bleu']:.4f}")
print(f"ROUGE-1: {rouge_score['rouge1']:.4f}")
print(f"ROUGE-2: {rouge_score['rouge2']:.4f}")
print(f"ROUGE-L: {rouge_score['rougeL']:.4f}")
print(f"BERTScore Precision: {P[0]:.4f}")
print(f"BERTScore Recall:    {R[0]:.4f}")
print(f"BERTScore F1:        {F1[0]:.4f}")
