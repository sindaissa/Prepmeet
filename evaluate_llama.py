import ollama
import evaluate

# 1. Tes prompts de test et les réponses de référence
prompts = [
    "Réponds en une seule phrase : Quelles sont les composants du sang ?"
    
   
]

references = [
    "Le sang est composé de globules rouges, de globules blancs, de plaquettes et de plasma."
   
    
]

# 2. Générer les réponses avec LLaMA3
responses = []
for prompt in prompts:
    print(f"⏳ Prompt: {prompt}")
    response = ollama.chat(model='llama3', messages=[{"role": "user", "content": prompt}])
    generated = response['message']['content'].strip()
    print(f"✅ Response: {generated}\n")
    responses.append(generated)

# 3. Évaluation BLEU
bleu = evaluate.load("bleu")
bleu_score = bleu.compute(predictions=responses, references=[[ref] for ref in references])

# 4. Évaluation ROUGE
rouge = evaluate.load("rouge")
rouge_score = rouge.compute(predictions=responses, references=references)

# 5. Évaluation BERTScore
bertscore = evaluate.load("bertscore")
bert_score = bertscore.compute(predictions=responses, references=references, lang="en")

# 6. Résultats
print("\n📊 Evaluation Results:")
print(f"BLEU: {bleu_score['bleu']:.4f}")
print(f"ROUGE-1: {rouge_score['rouge1']:.4f}")
print(f"ROUGE-2: {rouge_score['rouge2']:.4f}")
print(f"ROUGE-L: {rouge_score['rougeL']:.4f}")
print(f"BERTScore Precision: {sum(bert_score['precision']) / len(bert_score['precision']):.4f}")
print(f"BERTScore Recall:    {sum(bert_score['recall']) / len(bert_score['recall']):.4f}")
print(f"BERTScore F1:        {sum(bert_score['f1']) / len(bert_score['f1']):.4f}")

# 7. Évaluation LLM as a Judge
print("\n🧠 LLM as a Judge Evaluation:")

for i in range(len(prompts)):
    judge_prompt = f"""Tu es un expert. Voici une question, une réponse générée, et une réponse de référence. 
Évalue si la réponse générée est aussi bonne ou meilleure que la référence (oui/non) et explique pourquoi.

 Question: {prompts[i]}
 Réponse générée: {responses[i]}
 Référence: {references[i]}

Réponds par "Oui" ou "Non", puis explique en une phrase courte.
"""

    judgement = ollama.chat(model='llama3', messages=[{"role": "user", "content": judge_prompt}])
    print(f"🗳️ Jugement {i+1}: {judgement['message']['content'].strip()}\n")

