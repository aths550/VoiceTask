# VoiceTask

**VoiceTask — turn voice notes and WhatsApp-style chats into actionable tasks, in English, Hindi, or Hinglish.**

---

## Why this matters
We've all been there—trying to manage a team, family, or personal life through endless walls of text and long voice notes in WhatsApp. Important action items get buried in casual conversations, and managing this chaos manually is exhausting. VoiceTask is built specifically for how people (especially in India) actually communicate: mixing English, Hindi, and Hinglish. It instantly captures chaotic voice notes or texts, understands the context, and transforms them into organized, assigned tasks with deadlines. 

## Key Features
*   **Voice + Text Input:** Record audio natively in the browser or paste text messages.
*   **AI Task Extraction:** Automatically parses out the task title, owner, priority, and resolved calendar due date.
*   **Multi-Language Support:** Seamlessly works in English, Hindi, and Hinglish (code-switched mixed languages).
*   **Persistent Task Dashboard:** A beautiful, responsive interface to track active and completed tasks.
*   **Real Database Persistence:** Connected to Supabase for secure cloud storage of all tasks.

## Tech Stack
*   **Frontend:** React, Vite, Tailwind CSS, Lucide React Icons
*   **Backend:** Node.js, Express, Multer
*   **Database:** PostgreSQL (via Supabase)
*   **AI/LLM:** Groq API (Whisper-Large-v3 for transcription, Llama/OSS-120b for extraction)

## Architecture
`Voice/Text Input → Whisper Transcription (Groq) → LLM Task Extraction (Groq) → PostgreSQL (Supabase) → Dashboard`

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aths550/VoiceTask.git
    cd VoiceTask
    ```

2.  **Set up the Backend:**
    ```bash
    cd backend
    npm install
    cp .env.example .env
    ```
    *Open `backend/.env` and fill in your `SUPABASE_URL`, `SUPABASE_KEY`, and `GROQ_API_KEY`.*

3.  **Set up the Frontend:**
    ```bash
    cd ../frontend
    npm install
    cp .env.example .env
    ```
    *The default API URL `VITE_API_URL=http://localhost:5050/api` is pre-configured.*

4.  **Database Setup (Supabase):**
    Run the following SQL in your Supabase SQL Editor to create the tasks table:
    ```sql
    CREATE TABLE tasks (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      title text NOT NULL,
      description text,
      owner text DEFAULT 'You',
      due_date timestamp with time zone,
      priority text CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
      source text,
      status text CHECK (status IN ('pending', 'done')) DEFAULT 'pending',
      created_at timestamp with time zone DEFAULT now()
    );

    ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
    ```

5.  **Run locally:**
    In the `backend/` directory:
    ```bash
    npm run dev
    ```
    In the `frontend/` directory (in a new terminal):
    ```bash
    npm run dev
    ```
    Your app will be running at `http://localhost:5177` (or similar, depending on Vite).

## Demo
[https://www.loom.com/share/006f7998a3e048fdb516b6ea670e340c](#)

---
*Built for the iQOO Hackathon 2026 — Productivity Track.*
