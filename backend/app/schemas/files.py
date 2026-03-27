from pydantic import BaseModel, Field


class ExportRequest(BaseModel):
    filename: str = Field(
        min_length=1,
        max_length=100,
        pattern=r"^[\w\-]+$",
        description="Filename without extension. Alphanumeric, underscores, and hyphens only.",
    )
    content: str = Field(max_length=200_000)


class ExportResponse(BaseModel):
    success: bool
    download_name: str
    