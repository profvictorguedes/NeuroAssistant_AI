import logging
from pathlib import Path
from app.core.config import settings

logger = logging.getLogger(__name__)

_LOCAL_DIR = Path("exports")
_LOCAL_DIR.mkdir(exist_ok=True)


class AzureBlobService:
    def save_export(self, filename: str, content: str) -> str:
        filename = Path(filename).name  # sanitize before any use
        if not settings.azure_blob_connection_string:
            logger.warning("Azure Blob Storage not configured — saving to local disk.")
            return self._save_local(filename, content)

        try:
            from azure.storage.blob import BlobServiceClient

            service = BlobServiceClient.from_connection_string(settings.azure_blob_connection_string)
            container = service.get_container_client(settings.azure_blob_container)

            if not container.exists():
                container.create_container()

            blob = container.get_blob_client(filename)
            blob.upload_blob(content.encode("utf-8"), overwrite=True)

            logger.info("Uploaded '%s' to Azure Blob container '%s'.", filename, settings.azure_blob_container)
            return blob.url

        except Exception as exc:
            logger.error("Azure Blob Storage error: %s — falling back to local disk.", exc)
            return self._save_local(filename, content)

    @staticmethod
    def _save_local(filename: str, content: str) -> str:
        safe_name = Path(filename).name  # strip any directory components to prevent path traversal
        path = _LOCAL_DIR / safe_name
        path.write_text(content, encoding="utf-8")
        return str(path)