import json
import time
import requests
from typing import Dict
from dataclasses import dataclass
import numpy as np

from rouge_score import rouge_scorer
import nltk
from bert_score import score
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')


@dataclass
class BenchmarkResult:
    model_name: str
    response: str
    rouge_1: float
    rouge_2: float
    rouge_l: float
    bleu_score: float
    bert_precision: float
    bert_recall: float
    bert_f1: float
    response_time: float


class OllamaBenchmark:
    def __init__(self):
        self.question = "Réponds en une seule phrase : Quelles sont les composants du sang ?"
        # Reference answer for evaluation
        self.reference_answer = """Le sang est composé de globules rouges, de globules blancs, de plaquettes et de plasma."""

        self.rouge_scorer = rouge_scorer.RougeScorer(
            ['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
        self.smoothing = SmoothingFunction().method1
        self.ollama_url = "http://localhost:11434"  # Default Ollama URL

    def query_ollama(self, model: str) -> tuple[str, float]:
        """Query Ollama API locally"""
        url = f"{self.ollama_url}/api/generate"

        payload = {
            "model": model,
            "prompt": self.question,
            "stream": False
        }

        start_time = time.time()
        try:
            response = requests.post(url, json=payload)
            response_time = time.time() - start_time

            if response.status_code == 200:
                result = response.json()
                return result.get('response', ''), response_time
            else:
                print(
                    f"Ollama API Error: {response.status_code} - {response.text}")
                return "", 0
        except Exception as e:
            print(f"Error with Ollama API: {e}")
            print("Make sure Ollama is running with: ollama serve")
            return "", 0

    def query_ollama_chat(self, model: str) -> tuple[str, float]:
        """Query Ollama Chat API (for chat models)"""
        url = f"{self.ollama_url}/api/chat"

        payload = {
            "model": model,
            "messages": [
                {"role": "user", "content": self.question}
            ],
            "stream": False
        }

        start_time = time.time()
        try:
            response = requests.post(url, json=payload)
            response_time = time.time() - start_time

            if response.status_code == 200:
                result = response.json()
                return result.get('message', {}).get('content', ''), response_time
            else:
                print(
                    f"Ollama Chat API Error: {response.status_code} - {response.text}")
                return "", 0
        except Exception as e:
            print(f"Error with Ollama Chat API: {e}")
            return "", 0

    def list_available_models(self) -> list:
        """List available Ollama models"""
        url = f"{self.ollama_url}/api/tags"
        try:
            response = requests.get(url)
            if response.status_code == 200:
                models = response.json().get('models', [])
                return [model['name'] for model in models]
            else:
                print(f"Error listing models: {response.status_code}")
                return []
        except Exception as e:
            print(f"Error connecting to Ollama: {e}")
            return []

    def calculate_rouge_scores(self, response: str) -> Dict[str, float]:
        """Calculate ROUGE scores"""
        scores = self.rouge_scorer.score(self.reference_answer, response)
        return {
            'rouge1': scores['rouge1'].fmeasure,
            'rouge2': scores['rouge2'].fmeasure,
            'rougeL': scores['rougeL'].fmeasure
        }

    def calculate_bleu_score(self, response: str) -> float:
        """Calculate BLEU score"""
        reference = [self.reference_answer.split()]
        candidate = response.split()
        return sentence_bleu(reference, candidate, smoothing_function=self.smoothing)

    def calculate_bert_score(self, response: str) -> Dict[str, float]:
        """Calculate BERTScore"""
        P, R, F1 = score([response], [self.reference_answer],
                         lang="fr", verbose=False)
        return {
            'precision': P.item(),
            'recall': R.item(),
            'f1': F1.item()
        }

    def evaluate_response(self, model_name: str, response: str, response_time: float) -> BenchmarkResult:
        """Evaluate a single response"""
        rouge_scores = self.calculate_rouge_scores(response)
        bleu_score = self.calculate_bleu_score(response)
        bert_scores = self.calculate_bert_score(response)

        return BenchmarkResult(
            model_name=model_name,
            response=response,
            rouge_1=rouge_scores['rouge1'],
            rouge_2=rouge_scores['rouge2'],
            rouge_l=rouge_scores['rougeL'],
            bleu_score=bleu_score,
            bert_precision=bert_scores['precision'],
            bert_recall=bert_scores['recall'],
            bert_f1=bert_scores['f1'],
            response_time=response_time
        )

    def run_benchmark(self, model_name: str, use_chat_api: bool = False) -> BenchmarkResult:
        """Run benchmark on specified Ollama model"""
        print(f"Testing {model_name}...")

        if use_chat_api:
            response, response_time = self.query_ollama_chat(model_name)
        else:
            response, response_time = self.query_ollama(model_name)

        if response:
            result = self.evaluate_response(
                model_name, response, response_time)
            print(f"✓ Completed {model_name} test")
            return result
        else:
            print(f"✗ Failed {model_name} test")
            return None

    def run_multiple_models(self, model_names: list, use_chat_api: bool = False) -> list:
        """Run benchmark on multiple models"""
        results = []
        for model in model_names:
            result = self.run_benchmark(model, use_chat_api)
            if result:
                results.append(result)
        return results

    def print_results(self, results):
        """Print benchmark results"""
        if isinstance(results, BenchmarkResult):
            results = [results]

        print("\n" + "="*120)
        print("OLLAMA BENCHMARK RESULTS")
        print("="*120)
        print(f"{'Model':<25} {'ROUGE-1':<10} {'ROUGE-2':<10} {'ROUGE-L':<10} {'BLEU':<10} {'BERT-P':<10} {'BERT-R':<10} {'BERT-F1':<10} {'Time(s)':<10}")
        print("-"*120)

        for result in results:
            print(f"{result.model_name:<25} "
                  f"{result.rouge_1:<10.4f} "
                  f"{result.rouge_2:<10.4f} "
                  f"{result.rouge_l:<10.4f} "
                  f"{result.bleu_score:<10.4f} "
                  f"{result.bert_precision:<10.4f} "
                  f"{result.bert_recall:<10.4f} "
                  f"{result.bert_f1:<10.4f} "
                  f"{result.response_time:<10.2f}")

        print("\n" + "="*120)
        print("DETAILED RESPONSES")
        print("="*120)

        for result in results:
            print(f"\n{result.model_name}:")
            print("-" * len(result.model_name))
            print(result.response)

    def save_results(self, results, filename: str = "ollama_benchmark_results.json"):
        """Save results to JSON file"""
        if isinstance(results, BenchmarkResult):
            results = [results]

        results_dict = []
        for result in results:
            results_dict.append({
                'model_name': result.model_name,
                'response': result.response,
                'metrics': {
                    'rouge_1': result.rouge_1,
                    'rouge_2': result.rouge_2,
                    'rouge_l': result.rouge_l,
                    'bleu_score': result.bleu_score,
                    'bert_precision': result.bert_precision,
                    'bert_recall': result.bert_recall,
                    'bert_f1': result.bert_f1,
                    'response_time': result.response_time
                }
            })

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results_dict, f, indent=2, ensure_ascii=False)
        print(f"\nResults saved to {filename}")


# Example usage
if __name__ == "__main__":
    benchmark = OllamaBenchmark()

    # List available models
    print("Available models:")
    models = benchmark.list_available_models()
    for i, model in enumerate(models, 1):
        print(f"{i}. {model}")

    if not models:
        print("No models found. Make sure Ollama is running and you have models installed.")
        print("To install a model, run: ollama pull mistral")
        exit(1)

    # Example: Test specific models
    # You can specify which models to test
    models_to_test = [
        "mistral:latest",  # Change this to your installed models
        # "llama2:latest",
        # "codellama:latest",
    ]

    # Filter to only test models that are actually installed
    available_models_to_test = [
        model for model in models_to_test if model in models]

    if not available_models_to_test:
        print(f"None of the specified models are installed: {models_to_test}")
        print("Available models:", models)
        # Test the first available model as fallback
        if models:
            available_models_to_test = [models[0]]

    # Run benchmark on multiple models
    results = benchmark.run_multiple_models(
        available_models_to_test, use_chat_api=False)

    if results:
        # Display and save results
        benchmark.print_results(results)
        benchmark.save_results(results)
    else:
        print("No successful tests!")
