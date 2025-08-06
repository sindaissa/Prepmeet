import os
import json
import chromadb
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_ollama import OllamaEmbeddings
from chromadb.utils.embedding_functions import EmbeddingFunction

# Configuration
CLIENT_DIR = "C:/Users/nours/OneDrive/Desktop/summerCamp/MeetPrep/client_jsons"
COLLECTION_NAME = "client_meeting_prep"
EMBEDDING_MODEL = "nomic-embed-text"


class ChromaOllamaEmbeddings(EmbeddingFunction):
    def __init__(self, model_name=EMBEDDING_MODEL):
        self.model_name = model_name
        self.embeddings = OllamaEmbeddings(model=model_name)

    def __call__(self, texts):
        if isinstance(texts, str):
            texts = [texts]
        return self.embeddings.embed_documents(texts)

    def name(self):
        return f"Ollama-{self.model_name}"


def load_all_clients_data():
    docs = []
    for filename in os.listdir(CLIENT_DIR):
        if filename.endswith(".json"):
            path = os.path.join(CLIENT_DIR, filename)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    text = json.dumps(data, ensure_ascii=False)
                    docs.append(Document(
                        page_content=text,
                        metadata={"source": filename}
                    ))
            except Exception as e:
                print(f"Erreur de chargement {filename}: {str(e)}")
    return docs


def chunk_documents(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    return splitter.split_documents(docs)


def setup_chroma():
    chroma_client = chromadb.PersistentClient(path="./chroma_db")

    # Check if collection already exists
    try:
        collection = chroma_client.get_collection(COLLECTION_NAME)
        print(
            f"Collection '{COLLECTION_NAME}' already exists. Skipping initialization.")
        return collection
    except:
        pass

    # Delete existing collection if needed (optional, depending on use case)
    try:
        chroma_client.delete_collection(COLLECTION_NAME)
        print(f"Collection existante '{COLLECTION_NAME}' supprimée")
    except:
        pass

    embedding_fn = ChromaOllamaEmbeddings()
    collection = chroma_client.create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_fn
    )

    docs = load_all_clients_data()
    chunks = chunk_documents(docs)

    batch_size = 10
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        documents = [chunk.page_content for chunk in batch]
        metadatas = [chunk.metadata for chunk in batch]
        ids = [f"chunk_{i+j}" for j in range(len(batch))]

        collection.add(
            documents=documents,
            ids=ids,
            metadatas=metadatas
        )

    print(f"Base vectorielle initialisée avec {len(chunks)} fragments!")
    return collection


if __name__ == "__main__":
    setup_chroma()
