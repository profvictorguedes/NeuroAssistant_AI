from pydantic import BaseModel
from typing import Any


class ExportRequest(BaseModel):
    filename: str
    content: str


class ExportResponse(BaseModel):
    success: bool
    download_name: str


class BlobSessionExportRequest(BaseModel):
    container: str
    folder: str | None = None
    filename: str
    input_text: str
    output_text: str
    mode: str
    preferences: dict[str, Any]


class BlobSessionExportResponse(BaseModel):
    success: bool
    blob_name: str
    url: str | None = None


class BlobSessionImportRequest(BaseModel):
    container: str
    blob_name: str


class BlobSessionImportResponse(BaseModel):
    success: bool
    payload: dict[str, Any]


class BlobListRequest(BaseModel):
    container: str
    folder: str | None = None


class BlobListResponse(BaseModel):
    success: bool
    blobs: list[str]


class WordExportRequest(BaseModel):
    filename: str
    input_text: str
    output_text: str


class WordExportResponse(BaseModel):
    success: bool
    file_path: str | None = None
    fallback_text: str | None = None
    used_fallback: bool = False