from datetime import datetime
from io import BytesIO

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.files import (
    ExportRequest,
    ExportResponse,
    BlobSessionExportRequest,
    BlobSessionExportResponse,
    BlobSessionImportRequest,
    BlobSessionImportResponse,
    BlobListRequest,
    BlobListResponse,
    WordExportRequest,
)
from app.services.export_service import ExportService
from app.services.azure_blob_service import AzureBlobService
from app.services.word_export_service import WordExportService

router = APIRouter(prefix="/files", tags=["files"])


@router.post("/export", response_model=ExportResponse)
def export_markdown(payload: ExportRequest) -> ExportResponse:
    service = ExportService()
    path = service.export_markdown(payload.filename, payload.content)
    return ExportResponse(success=True, download_name=path)


@router.post("/blob/export-session", response_model=BlobSessionExportResponse)
def blob_export_session(payload: BlobSessionExportRequest) -> BlobSessionExportResponse:
    service = AzureBlobService()

    filename = payload.filename
    if not filename.endswith(".json"):
        filename = f"{filename}.json"

    session_payload = {
        "exported_at": datetime.utcnow().isoformat(),
        "input_text": payload.input_text,
        "output_text": payload.output_text,
        "mode": payload.mode,
        "preferences": payload.preferences,
    }

    result = service.upload_session_json(
        container=payload.container,
        folder=payload.folder,
        filename=filename,
        payload=session_payload,
    )
    return BlobSessionExportResponse(success=True, blob_name=result["blob_name"], url=result["url"])


@router.post("/blob/list", response_model=BlobListResponse)
def blob_list(payload: BlobListRequest) -> BlobListResponse:
    service = AzureBlobService()
    blobs = service.list_session_files(container=payload.container, folder=payload.folder)
    return BlobListResponse(success=True, blobs=blobs)


@router.post("/blob/import-session", response_model=BlobSessionImportResponse)
def blob_import_session(payload: BlobSessionImportRequest) -> BlobSessionImportResponse:
    service = AzureBlobService()
    data = service.download_session_json(container=payload.container, blob_name=payload.blob_name)
    return BlobSessionImportResponse(success=True, payload=data)


@router.post("/word/download")
def word_download(payload: WordExportRequest):
    service = WordExportService()
    file_bytes = service.export_docx_bytes(payload.input_text, payload.output_text)

    filename = payload.filename
    if not filename.endswith(".docx"):
        filename = f"{filename}.docx"

    return StreamingResponse(
        BytesIO(file_bytes),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )