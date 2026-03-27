# NeuroAssistant AI

A hackathon proof of concept for reducing cognitive load for neurodiverse users through an adaptive AI assistant. Users paste dense text, choose a processing mode, set accessibility preferences, and receive a restructured, calmer, more actionable output.

## Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + framer-motion
- **Backend:** FastAPI + Pydantic v2 + Python 3.11+
- **Azure integrations:**
  - Azure OpenAI — adaptive text transformation
  - Azure AI Search — grounding context retrieval
  - Azure Blob Storage — export storage
  - Azure AI Content Safety — input screening

All Azure services have graceful fallbacks (mock/local), so the app runs fully without any Azure credentials.

---

## Run locally

### Prerequisites

- Python 3.11+
- Node.js 20+

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env          # fill in Azure credentials or leave USE_MOCK_AI=true
uvicorn app.main:app --reload --port 8000
```

API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env          # set VITE_API_BASE_URL if needed
npm run dev
```

App will be available at `http://localhost:5173`.

### Run with Docker

```bash
cp backend/.env.example backend/.env   # configure as needed
cp frontend/.env.example frontend/.env
docker compose up --build
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

### Run tests

```bash
cd backend
python -m pytest tests/ -v
```

---

## Configuration

Copy `backend/.env.example` to `backend/.env` and fill in your values.

| Variable | Default | Description |
|----------|---------|-------------|
| `USE_MOCK_AI` | `true` | Set to `false` to use real Azure services |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated list of allowed origins |
| `AZURE_OPENAI_ENDPOINT` | — | Azure OpenAI resource endpoint |
| `AZURE_OPENAI_API_KEY` | — | Azure OpenAI API key |
| `AZURE_OPENAI_DEPLOYMENT` | — | Deployment name (e.g. `gpt-4o`) |
| `AZURE_OPENAI_API_VERSION` | `2024-10-21` | API version |
| `AZURE_SEARCH_ENDPOINT` | — | Azure AI Search endpoint |
| `AZURE_SEARCH_API_KEY` | — | Azure AI Search API key |
| `AZURE_SEARCH_INDEX` | — | Index name |
| `AZURE_BLOB_CONNECTION_STRING` | — | Blob Storage connection string |
| `AZURE_BLOB_CONTAINER` | `neuroassistant-exports` | Container name |
| `AZURE_CONTENT_SAFETY_ENDPOINT` | — | Content Safety endpoint |
| `AZURE_CONTENT_SAFETY_API_KEY` | — | Content Safety API key |

---

## Processing modes

| Mode | What it does |
|------|-------------|
| **Simplify** | Rewrites content in plain language with short, clear sentences |
| **Prioritize** | Ranks the most important actions and removes noise |
| **Study** | Produces a summary, key points, a mini quiz, and a next step |
| **Focus** | Extracts one clear next action with a suggested time block |
| **Calm** | Reframes content in a calm tone broken into small steps |
| **Task Breakdown** | Decomposes content into 3–5 sequenced, concrete sub-tasks |

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `POST` | `/api/v1/assistant/transform` | Transform text with selected mode and preferences |
| `POST` | `/api/v1/files/export` | Export result as a `.md` file |

---

## Project structure

```
neuroassistant-ai/
├── docker-compose.yml
├── README.md
├── frontend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── hooks/useAssistant.ts       # all interactive state
│       ├── lib/api.ts                  # axios API client
│       ├── types/api.ts                # TypeScript types mirroring backend schemas
│       ├── data/sampleInputs.ts        # pre-canned demo inputs
│       ├── pages/HomePage.tsx
│       └── components/
│           ├── layout/                 # Navbar, Hero, Footer, RightRail
│           ├── ui/                     # Button, Card, Badge, Toggle, LoadingDots
│           └── demo/                   # Workspace, InputPanel, OutputPanel,
│                                       # ModeSelector, PreferencePanel,
│                                       # ExplainabilityPanel, MetricsStrip,
│                                       # AzureArchitecture, ResponsibleAI
└── backend/
    ├── Dockerfile
    ├── .env.example
    ├── requirements.txt
    ├── pyproject.toml
    └── app/
        ├── main.py                     # FastAPI app, CORS, router mounts
        ├── core/
        │   ├── config.py               # pydantic-settings, all env vars
        │   ├── exceptions.py           # ServiceError
        │   └── logging.py              # basicConfig setup
        ├── api/routes/
        │   ├── health.py
        │   ├── assistant.py
        │   └── files.py
        ├── schemas/
        │   ├── assistant.py            # AssistantRequest/Result/Response
        │   ├── files.py                # ExportRequest/Response
        │   └── common.py              # HealthResponse
        ├── services/
        │   ├── orchestrator.py         # wires safety → search → AI
        │   ├── mock_ai_services.py     # static fallback (USE_MOCK_AI=true)
        │   ├── azure_openai_service.py
        │   ├── azure_search_service.py
        │   ├── azure_blob_service.py
        │   ├── azure_content_safety_service.py
        │   └── export_service.py
        └── tests/
            ├── test_health.py
            ├── test_assistant_transform.py
            ├── test_assistant_validation.py
            └── test_export.py
```
