import logging

from fastapi import APIRouter, HTTPException
from app.core.exceptions import ServiceError
from app.schemas.assistant import AssistantRequest, AssistantResponse
from app.services.orchestrator import AssistantOrchestrator

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/assistant", tags=["assistant"])


@router.post("/transform", response_model=AssistantResponse)
def transform(payload: AssistantRequest) -> AssistantResponse:
    try:
        orchestrator = AssistantOrchestrator()
        return orchestrator.run(payload)
    except ServiceError as exc:
        logger.exception("ServiceError during assistant transform: %s", exc)
        raise HTTPException(status_code=400, detail=exc.message) from exc
    except Exception as exc:
        logger.exception("Unhandled error during assistant transform: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc