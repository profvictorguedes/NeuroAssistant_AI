from pydantic import BaseModel

class ExportRequest(BaseModel):
    filename: str
    content: str

class ExportResponse(BaseModel):
    success: bool 
    download_name: str
    