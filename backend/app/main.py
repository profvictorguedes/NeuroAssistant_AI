from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.logging import setup_logging
from app.api.routes.health import router as health_router
from app.api.routes.assistant import router as assistant_router
from app.api.routes.files import router as files_router

setup_logging()

app = FastAPI(title="NeuroAssistant API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")
app.include_router(assistant_router, prefix="/api/v1")
app.include_router(files_router, prefix="/api/v1")

@app.get("/")
async def read_root():
    return {"message": "Welcome to the NeuroAssistant API!"}