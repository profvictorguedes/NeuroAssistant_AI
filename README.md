# NeuroAssistant_AI

The project file structure is as follows:

neuroassistant-ai/
├── .gitignore
├── README.md
├── docker-compose.yml
├── frontend/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── vite-env.d.ts
│       ├── types/
│       │   └── api.ts
│       ├── lib/
│       │   ├── api.ts
│       │   └── utils.ts
│       ├── data/
│       │   └── sampleInputs.ts
│       ├── hooks/
│       │   └── useAssistant.ts
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.tsx
│       │   │   ├── Hero.tsx
│       │   │   └── Footer.tsx
│       │   ├── ui/
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Badge.tsx
│       │   │   ├── Toggle.tsx
│       │   │   └── LoadingDots.tsx
│       │   └── demo/
│       │       ├── Workspace.tsx
│       │       ├── InputPanel.tsx
│       │       ├── PreferencePanel.tsx
│       │       ├── ModeSelector.tsx
│       │       ├── OutputPanel.tsx
│       │       ├── ExplainabilityPanel.tsx
│       │       ├── AzureArchitecture.tsx
│       │       ├── ResponsibleAI.tsx
│       │       └── MetricsStrip.tsx
│       └── pages/
│           └── HomePage.tsx
└── backend/
    ├── .env.example
    ├── pyproject.toml
    ├── app/
    │   ├── main.py
    │   ├── core/
    │   │   ├── config.py
    │   │   ├── logging.py
    │   │   └── exceptions.py
    │   ├── api/
    │   │   └── routes/
    │   │       ├── health.py
    │   │       ├── assistant.py
    │   │       └── files.py
    │   ├── schemas/
    │   │   ├── common.py
    │   │   ├── assistant.py
    │   │   └── files.py
    │   ├── services/
    │   │   ├── orchestrator.py
    │   │   ├── mock_ai_service.py
    │   │   ├── azure_openai_service.py
    │   │   ├── azure_search_service.py
    │   │   ├── azure_blob_service.py
    │   │   ├── azure_content_safety_service.py
    │   │   └── export_service.py
    │   └── utils/
    │       └── text.py
    └── tests/
        ├── test_health.py
        ├── test_assistant_transform.py
        ├── test_assistant_validation.py
        └── test_export.py
