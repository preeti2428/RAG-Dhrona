# 🤖 RAG-Dhrona
RAG-Dhrona is a full-stack **Retrieval-Augmented Generation (RAG)** application. It allows users to interactively chat with and extract insights from a custom knowledge base (specifically, documents regarding Universal Human Values, Happiness, and Prosperity) using natural language.
The application uses state-of-the-art LLMs to read the provided text documents, generate semantic embeddings, and retrieve the most relevant information to answer user queries with high accuracy and context-awareness.
## 🚀 Features
- **Conversational Interface:** A beautiful, responsive chat UI built with React and Tailwind CSS.
- **Voice Capabilities:** Includes a Speech-to-Text (Microphone) input and Text-to-Speech (Voice Output) toggle.
- **Dark/Light Mode:** Full theme support for a comfortable reading experience.
- **Smart Retrieval:** Uses Langchain and ChromaDB to perform highly accurate similarity searches over the document chunks.
- **Powered by Gemini:** Integrates Google's advanced `gemini-2.0-flash` model for lightning-fast and intelligent response generation.
## 🛠️ Technologies Used
### Frontend
- **React.js** (Bootstrapped with Vite)
- **Tailwind CSS** for rapid and modern styling
- **Lucide React** for beautiful iconography
- **Axios** for handling HTTP requests to the backend
- **Web Speech API** for native speech recognition and synthesis
### Backend
- **FastAPI** & **Uvicorn** for a robust, high-performance Python server
- **Langchain** for orchestrating the RAG pipeline (loaders, splitters, embeddings, and chains)
- **ChromaDB** as the local vector database to store and query document embeddings
- **Google Generative AI** (`langchain-google-genai`) for LLM inference and text embeddings
- **Sentence Transformers** / HuggingFace for additional embedding support
- **PyPDF & Docx2txt** for robust document ingestion
