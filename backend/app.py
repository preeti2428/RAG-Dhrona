from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router
from rag import init_rag_system
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="RAG Backend")

# Setup CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG on startup
@app.on_event("startup")
async def startup_event():
    # Only initialize if a vector database exists
    import os
    db_path = os.path.join(os.path.dirname(__file__), "chroma_db")
    if os.path.exists(db_path):
        init_rag_system()
    else:
        print("Warning: ChromaDB not found. Please run ingest.py to load documents before querying.")

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
