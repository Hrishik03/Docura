# Docura

Docura is a Retrieval-Augmented Generation (RAG) web application that lets you chat with your documents. Upload PDFs, DOCX, or TXT files and Docura processes, indexes, and searches them so you can ask natural-language questions and receive AI-powered answers grounded in your documents.

Built with a React frontend, a Python backend (FastAPI), and Supabase authentication. Docura is designed as a simple, extensible reference implementation for document chat workflows.

---

## Features
- Upload and index documents (PDF, DOCX, TXT)
- Full-text and vector-based search for relevant document chunks
- Natural-language Q&A over your documents using an LLM
- User authentication via Supabase

---

## Demo / Screenshots

---

## Architecture & Tech Stack
- Frontend: React + Vite
- Backend: Python (FastAPI) — provides ingestion, indexing, and query endpoints
- Auth: Supabase (email/password)
- Vector store: configurable (Chromadb)
- LLM: configurable (Gemini 2.5 flash)
- Storage: Supabase Storage

High level flow:
1. User uploads document(s) via the frontend.
2. Backend extracts text, splits into chunks, computes embeddings, and stores vectors + metadata.
3. User asks a question in the chat UI.
4. Backend finds the most relevant chunks, constructs a prompt + context, queries the LLM, and returns a grounded answer.

---

## Getting started (local development)

Prerequisites
- Node.js (16+ recommended) and npm or yarn
- Python 3.10+ and pip
- Supabase project (for auth and storage)
- Gemini API key (or other LLM provider key)

Quickstart (example)
1. Clone the repo
   git clone https://github.com/Hrishik03/Docura.git
   cd Docura

2. Frontend
   - Move to the client directory:
     cd client
   - Install dependencies:
     npm install
   - Start the dev server:
     npm run dev
   - Visit: http://localhost:5173 (or the port shown by Vite)

3. Backend
   - Return to the repo root and create a virtual environment:
     python -m venv .venv
     source .venv/bin/activate  # macOS / Linux
     .venv\Scripts\activate     # Windows (PowerShell)
   - Install Python dependencies (if a requirements file exists):
     pip install -r requirements.txt
   - Start the server (example using Uvicorn / FastAPI):
     uvicorn app.main:app --reload
   - API runs on: http://localhost:8000 (or your configured port)

Notes
- Adjust commands to match your repo structure and entrypoints. Check `client/package.json` and the backend entry file (e.g., `app/main.py`) for exact start commands.

---

## Environment variables

Create a `.env` file (or set env vars in your deployment environment). Typical variables:

Frontend (client/.env or .env.local)
- VITE_API_URL=http://localhost:8000
- VITE_SUPABASE_URL=<your-supabase-url>
- VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

Backend (.env)
- GEMINI_API_KEY=<your-gemini-api-key>
- SUPABASE_ANON_KEY=<your-supabase-anon-key>
- SUPABASE_BUCKET=<your-supabase-bucket-name>
- SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>

Security
- Never commit secrets or API keys to the repository. Use a `.env` file listed in `.gitignore` or secret management for deployments.
- Prefer the minimal required privileges: use the anon key on the client and the service role key on the backend only where necessary.

---

## Usage

1. Register / sign in with Supabase auth (email).
2. Upload documents from the dashboard.
3. Wait for ingestion/indexing to complete (the UI should show status).
4. Ask questions in the chat interface. Docura will return answers with referenced document snippets when available.

Tips
- For best results, keep documents reasonably sized(<10MB) and use an embedding/vector-store configuration that matches your LLM and scale needs.
- If answers are hallucinating, inspect the retrieved context snippets to ensure the retriever is returning relevant chunks.


---

## Contributing

How to contribute:
1. Fork the repo
2. Create a feature branch: git checkout -b feat/my-change
3. Open a pull request describing your changes

Please follow standard commit message and PR conventions used in the project.


---

Maintainers
- @Hrishik03 (repo owner)

Acknowledgements
- Built using modern OSS tooling: React, Vite, FastAPI, Supabase, Chromadb, and Gemini.
