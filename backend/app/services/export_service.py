from app.services.azure_blob_service import AzureBlobService


class ExportService:
    def __init__(self) -> None:
        self.storage = AzureBlobService()

    def export_markdown(self, filename: str, content: str) -> str:
        if not filename.endswith(".md"):
            filename = f"{filename}.md"
        return self.storage.save_export(filename, content)