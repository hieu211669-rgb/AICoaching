# CoachAI Gym System

A modern AI-powered coaching platform built with Next.js, Tailwind CSS, and FastAPI, using Gemma for AI processing.

## Prerequisites
- [Ollama](https://ollama.com/) installed and running.
- Python 3.9+
- Node.js 18+

## Setup Instructions

### 1. AI Model Setup
Run the following command to pull the Gemma model (using the tag specified):
```bash
ollama pull gemma4:latest
```

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   python main.py
   ```
   The backend will run on `http://localhost:8000`.

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

## Features
- **Home**: Overview and value proposition.
- **Dashboard**: Training summary and recent activity.
- **Coaching Hub**: Real-time chat with Gemma for workout advice.
- **Progress Tracking**: Visual metrics and personal records.
- **Profile**: Account and AI personality settings.
