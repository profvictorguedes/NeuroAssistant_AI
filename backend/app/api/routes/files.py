from fastapi import APIRouter
from app.schemas.files import ExportRequest, ExportResponse
from app.services.export_service import ExportService

router = APIRouter(prefix="/files", tags=["files"])

_export_service = ExportService()


@router.post("/export", response_model=ExportResponse)
def export_markdown(payload: ExportRequest) -> ExportResponse:
    path = _export_service.export_markdown(payload.filename, payload.content)
    return ExportResponse(success=True, download_name=path)