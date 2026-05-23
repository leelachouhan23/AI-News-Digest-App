# 🗞️ AI News Digest

Paste any news article and get an instant AI-powered digest: summary, key facts, ELI5, or bias check — powered by Groq's Llama 3.

---

## Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **AI**: Groq API (`llama-3.1-8b-instant`)

---

## Features

1. Paste any news article
2. Select a digest mode:
   - **Summary** — concise overview
   - **Key Facts** — bullet-point facts
   - **ELI5** — explain like I'm 5
   - **Bias Check** — detect framing & bias
3. Click Generate — get your AI digest instantly

---

## Prompt Design Notes

The prompts were designed to support multiple digest styles while keeping responses concise and focused.

- **Summary Mode** generates a short neutral overview in 3–5 sentences.
- **Key Facts Mode** extracts the most important factual points in numbered format.
- **ELI5 Mode** simplifies complex news topics using beginner-friendly language and analogies.
- **Bias Check Mode** analyzes framing, loaded language, and missing perspectives to encourage critical reading.

Prompt instructions were structured dynamically using JavaScript `reduce()` to make the system scalable and easy to extend with additional modes.

---

## Quick Start

### 1. Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

---

### 2. Add Your Groq API Key

Copy the example environment file:

```bash
cp server/.env.example server/.env
```

Open `server/.env` and replace:

```env
GROQ_API_KEY=YOUR_API_KEY_HERE
```

with your actual Groq API key.

Get a free API key from:

https://console.groq.com

---

### 3. Run Both Servers

### Terminal 1 — Backend

```bash
cd server
npm run dev
```

### Terminal 2 — Frontend

```bash
cd client
npm run dev
```

---

## Local URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## Deployment

### Backend (Render / Railway / Fly.io)

- Root directory: `server/`
- Start command:

```bash
node server.js
```

- Environment variable required:

```env
GROQ_API_KEY=your_api_key
```

---

### Frontend (Vercel / Netlify)

- Root directory: `client/`
- Build command:

```bash
npm run build
```

- Output directory:

```bash
dist/
```

- Environment variable:

```env
VITE_API_URL=https://your-backend-url.com
```

---

## Tech Highlights

- Uses `async/await` for API handling
- Uses JavaScript `reduce()` for dynamic prompt generation
- Uses `filter()` for article sanitization
- REST API architecture with Express
- Responsive frontend built with React + Vite

---

## Future Improvements

- Add article URL scraping support
- Add multilingual summaries
- Add dark mode toggle
- Add article history and saved digests
- Add speech/audio summaries
