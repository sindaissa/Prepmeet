import google.generativeai as genai

class GeminiInteractionAgent:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

    def send_prompt(self, prompt_text):
        try:
            response = self.model.generate_content(prompt_text)
            return response.text
        except Exception as e:
            return f"❌ Erreur lors de l'appel à Gemini : {e}"

    def get_chat(self):
        return self.model.start_chat(history=[])
