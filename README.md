# 🤖 RAG-Dhrona

A modern, high-performance full-stack **Retrieval-Augmented Generation (RAG)** application. It allows users to interactively chat with and extract insights from a custom knowledge base using natural language, featuring a sleek UI and voice capabilities.

## ✨ Features

- **Conversational Interface:** A beautiful, responsive chat UI built with React and Tailwind CSS.
- **Voice Capabilities:** Includes a Speech-to-Text (Microphone) input and Text-to-Speech (Voice Output) toggle.
- **Dark/Light Mode:** Full theme support for a comfortable reading experience.
- **Smart Retrieval:** Uses Langchain and ChromaDB to perform highly accurate similarity searches over the document chunks.
- **Powered by Gemini:** Integrates Google's advanced `gemini-2.0-flash` model for lightning-fast and intelligent response generation.

## 🛠️ Tech Stack

### Frontend
- **React.js** (Bootstrapped with Vite)
- **Tailwind CSS** (Rapid and modern styling)
- **Lucide React** (Beautiful iconography)
- **Axios** (Handling HTTP requests)
- **Web Speech API** (Native speech recognition and synthesis)

### Backend
- **FastAPI + Uvicorn** (Robust, high-performance Python server)
- **Langchain** (Orchestrating the RAG pipeline)
- **ChromaDB** (Local vector database)
- **Google Generative AI** (`langchain-google-genai` for LLM inference)
- **Sentence Transformers** (HuggingFace for additional embedding support)
- **PyPDF & Docx2txt** (Robust document ingestion)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Python 3.8 or higher

### Installation
Clone the repository

```bash
git clone https://github.com/preeti2428/RAG-Dhrona.git
cd RAG-Dhrona
```

### Setup the Backend

```bash
cd backend
python -m venv venv

# Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder and add your Google API Key:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

Ingest the documents to create the Vector Database:
```bash
python ingest.py human_values.txt
```

Start the FastAPI server (runs on http://localhost:8000):
```bash
python app.py
```

### Setup the Frontend 
Open a new terminal window:

```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```

### Open the App 
Visit `http://localhost:5173` (or the port specified by Vite) in your browser.

## 📂 Project Structure

```text
├── backend/                # Backend FastAPI application
│   ├── chroma_db/          # Local vector database storage
│   ├── app.py              # Main FastAPI server and configuration
│   ├── ingest.py           # Document ingestion and chunking script
│   ├── rag.py              # Retrieval Augmented Generation logic
│   ├── routes.py           # API endpoints routing
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Frontend React application
│   ├── public/             # Static public assets
│   ├── src/                # React components, styles, and logic
│   ├── index.html          # Main HTML entry point
│   ├── package.json        # Frontend dependencies and scripts
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── vite.config.js      # Vite build configuration
└── README.md               # Project documentation
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is open source and available under the MIT License.
