## Docura

Docura is a Retrieval-Augmented Generation (RAG) web app that lets you **chat with your documents**.

Upload PDFs, DOCX, or TXT files, the backend will extract, chunk, embed and index the content, and you can then ask natural‑language questions and get **AI‑powered answers grounded in that document**.  
The app uses **Supabase** for authentication and document metadata, a **FastAPI** backend with a **ChromaDB** vector store, and a **React + Vite** frontend.

---

## Features

- **Document upload**
  - Supports **PDF**, **DOCX**, and **TXT**
  - Files are uploaded to Supabase storage
- **RAG question answering**
  - Extracts and chunks document text
  - Embeds chunks using **Google Gemini embeddings (`text-embedding-004`)**
  - Stores embeddings in **ChromaDB**
  - Answers questions using a RAG pipeline over the stored chunks
- **Chat interface**
  - Clean chat UI with typing indicator
  - Answers rendered with markdown support
- **User authentication**
  - Email/password auth via **Supabase**
  - Basic profile handling (username via `profiles` table)
- **Cloud‑ready**
  - Frontend built with **Vite + React**
  - Backend built with **FastAPI**
  - Frontend deployable to **Vercel**
  - Backend deployable to any Python host (e.g. Render, Railway, EC2, etc.)

---

## Project Structure

```text
RAG_app/
  README.md           # Main project readme
  client/             # React + Vite frontend
    src/
      App.jsx
      main.jsx
      supabase.jsx
      components/
        authPage.jsx
        landingPage.jsx
        loadingPage.jsx
        chatPage.jsx
    vite.config.js
    vercel.json
    package.json
    .env              # Frontend env vars (local only, not committed)
  server/             # FastAPI backend
    main.py
    chunker.py
    embeddings.py
    extractor.py
    rag.py
    vectorstore.py
    utils.py
    supabase_client.py
    requirements.txt
    chroma_db/        # Local ChromaDB data
    .env              # Backend env vars (local only, not committed)
```

---

## Tech Stack

- **Frontend**
  - React (Vite)
  - Tailwind CSS (via `@tailwindcss/vite`)
  - React Markdown for answer rendering
  - Supabase JS client for auth
- **Backend**
  - FastAPI
  - ChromaDB for vector storage
  - Google Generative AI (`google-generativeai`) for embeddings
  - Supabase Python client for document metadata + storage
- **Auth & Storage**
  - Supabase (auth, profiles, documents table, storage bucket)

---

## Frontend (client) Overview

### Main flow (`client/src/App.jsx`)

The React app uses simple internal state to manage the flow instead of a full router:

- **`screen = "auth"`** → `AuthPage`
- **`screen = "landing"`** → `LandingPage`
- **`screen = "processing"`** → `LoadingPage` (while upload/indexing happens)
- **`screen = "chat"`** → `ChatPage` (chat with the uploaded document)

Key actions:

- **Login / Signup**
  - Done in `AuthPage` using Supabase email/password
  - On success, `onAuthSuccess(user)` is called and the app moves to `"landing"` screen
- **Upload document**
  - On `LandingPage`, clicking the upload button opens a file picker
  - Selected file is sent to the backend `/upload` endpoint as `FormData`
  - On success, the returned `doc_id` is stored and the app moves to `"chat"` screen
- **Chat with document**
  - `ChatPage` sends user questions and the `doc_id` to the backend `/query` endpoint
  - Backend returns an answer string, which is formatted and displayed as a bot message

### Frontend Environment Variables

The frontend uses **Vite env variables**, which must **start with `VITE_`**:

- `VITE_API_URL`  
  **Base URL for the backend API** (e.g. `http://127.0.0.1:8000` in dev, or your deployed FastAPI URL in production).

- `VITE_SUPABASE_URL`  
  Supabase project URL.

- `VITE_SUPABASE_ANON_KEY`  
  Supabase anonymous public key.

Create a `.env` file in `client/` (not committed):

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Then restart the Vite dev server after any change to `.env`.

---

## Backend (server) Overview

### API (`server/main.py`)

- **`POST /upload`**
  - Accepts `file: UploadFile` (PDF/DOCX/TXT)
  - Optional `user_id: str` (Supabase `auth.users.id`)
  - Steps:
    1. Uploads the raw file to Supabase storage (`upload_to_supabase`)
    2. Extracts text from the file (`extract_text`)
    3. Chunks text (`chunk_text`)
    4. Creates embeddings for each chunk (`embed_text_list` via Google Gemini)
    5. Stores chunks + embeddings in ChromaDB (`add_to_db`)
    6. (Optionally) Inserts a row into `documents` table in Supabase with `user_id`, `doc_id`, `file_name`, `file_url`
  - Returns JSON with:
    - `doc_id`
    - `file_name`
    - `file_url`
    - `num_chunks`
    - `status`

- **`POST /query`**
  - Accepts JSON body:
    ```json
    {
      "query": "user question",
      "doc_id": "document-uuid"
    }
    ```
  - Uses `generate_answer` from `rag.py` to:
    - retrieve relevant chunks from ChromaDB for `doc_id`
    - call the LLM with context (RAG)
    - return the answer text in JSON

- **`GET /`**
  - Simple health check: `{"message": "RAG backend running successfully!"}`

### Embeddings (`server/embeddings.py`)

- Uses **Google Generative AI**:
  - Model: `models/text-embedding-004`
  - Env var: `GEMINI_API_KEY`

### Supabase client (`server/supabase_client.py`)

- Uses backend‑side Supabase **service role key** for privileged operations:

```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

> **Important:** The service role key is **secret** and must never be exposed to the frontend.

### Backend Environment Variables

In `server/.env` (not committed):

```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

You may also need any other keys used by `utils.py` / `extractor.py` if you extend functionality.

---

## Running the Project Locally

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd RAG_app
```

### 2. Set up the backend (FastAPI)

```bash
cd server

# (Optional but recommended) create a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create `server/.env`:

```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Then run the API:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://127.0.0.1:8000`.

You can test quickly:

- `GET http://127.0.0.1:8000/` → should return the health message.
- Use tools like Postman/Insomnia or curl to hit `/upload` and `/query`.

### 3. Set up the frontend (React + Vite)

In a **separate terminal**:

```bash
cd client

# Install dependencies
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Then run the dev server:

```bash
npm run dev
```

Vite will show a local URL (usually `http://localhost:5173`).  
Open it in your browser to use the app.

---

## Production / Deployment Notes

### Frontend (Vercel)

- **Root directory**: `client`
- **Build command**: `npm run build`
- **Output directory**: `dist`
- Add environment variables in Vercel project settings:
  - `VITE_API_URL=https://your-backend-host.com`
  - `VITE_SUPABASE_URL=YOUR_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY`

Optional `vercel.json` in `client/` (for simple SPA routing):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Backend

You can deploy the FastAPI server to any Python‑friendly host (Render, Railway, EC2, etc.):

- Run `uvicorn main:app` (or a similar command depending on the provider)
- Set environment variables:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GEMINI_API_KEY`
- Update `VITE_API_URL` in your frontend env to point to this deployed backend.

---

## Supabase Setup (High Level)

You’ll need a Supabase project with:

- **Auth** enabled (email/password)
- A **`profiles`** table (or similar) containing a row per user
  - Typically has `id` (UUID, references `auth.users.id`) and `username`
- A **`documents`** table with columns like:
  - `user_id` (UUID → `auth.users.id`)
  - `doc_id` (UUID generated in backend)
  - `file_name`
  - `file_url`
- A **storage bucket** for uploaded files that `upload_to_supabase` writes into.

Configure RLS policies as appropriate for your security model.

---

## Scripts

### Frontend (in `client/package.json`)

- `npm run dev` – start Vite dev server
- `npm run build` – build production bundle
- `npm run preview` – preview production build
- `npm run lint` – run ESLint

### Backend

- There is no `package.json` here; just use:
  - `pip install -r requirements.txt`
  - `uvicorn main:app --reload --host 0.0.0.0 --port 8000`

---

## Future Improvements

- Better error handling and user feedback in the UI
- Per‑user document listing/history
- Multi‑document querying
- More granular access control and RLS policies in Supabase
- Support for more file types (e.g. images with OCR pipeline extensions)
