import os
import argparse
from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

DB_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

def load_documents(file_path: str):
    print(f"Loading document: {file_path}")
    if file_path.endswith('.pdf'):
        loader = PyPDFLoader(file_path)
    elif file_path.endswith('.txt'):
        loader = TextLoader(file_path, encoding='utf-8')
    elif file_path.endswith('.docx'):
        loader = Docx2txtLoader(file_path)
    else:
        raise ValueError("Unsupported file format. Please use PDF, TXT, or DOCX.")
    
    return loader.load()

def ingest_file(file_path: str):
    docs = load_documents(file_path)
    print(f"Loaded {len(docs)} pages/sections.")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )
    chunks = text_splitter.split_documents(docs)
    print(f"Split into {len(chunks)} chunks.")

    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    print("Saving to ChromaDB...")
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=DB_DIR
    )
    print("Ingestion complete!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest a document into the RAG vector store.")
    parser.add_argument("file_path", type=str, help="Path to the PDF, TXT, or DOCX file")
    args = parser.parse_args()
    
    if os.path.exists(args.file_path):
        ingest_file(args.file_path)
    else:
        print("File not found.")
