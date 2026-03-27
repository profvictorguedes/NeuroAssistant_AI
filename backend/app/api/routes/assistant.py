from fastapi import APIRouter, HTTPException
from app.core.exceptions import ServiceError
from app.schemas.assistant import AssistantRequest, AssistantResponse
from app.services.orchestrator import AssistantOrchestrator

router = APIRouter(prefix="/assistant", tags=["assistant"])

_orchestrator = AssistantOrchestrator()


@router.post("/transform", response_model=AssistantResponse)
def transform(payload: AssistantRequest) -> AssistantResponse:
    try:
        return _orchestrator.run(payload)
    except ServiceError as exc:
        raise HTTPException(status_code=400, detail=exc.message) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.") from exc