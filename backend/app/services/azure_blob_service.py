import json
import logging
from pathlib import Path

from azure.core.exceptions import ResourceExistsError
from azure.storage.blob import BlobServiceClient

from app.core.config import settings

logger = logging.getLogger(__name__)

EXPORT_DIR = Path("exports")
EXPORT_DIR.mkdir(exist_ok=True)


class AzureBlobService:
    def __init__(self) -> None:
        self.connection_string = settings.azure_blob_connection_string
        self.default_container = settings.azure_blob_container

        self.client = None
        if self.connection_string:
            self.client = BlobServiceClient.from_connection_string(
                self.connection_string
            )

    def _ensure_container(self, container_name: str) -> None:
        if not self.client:
            return

        container_client = self.client.get_container_client(container_name)
        try:
            container_client.create_container()
        except ResourceExistsError:
            pass

    def _build_blob_name(self, folder: str | None, filename: str) -> str:
        clean_folder = (folder or "").strip().strip("/")
        clean_filename = filename.strip()

        if clean_folder:
            return f"{clean_folder}/{clean_filename}"
        return clean_filename

    def save_export(self, filename: str, content: str) -> str:
        local_path = EXPORT_DIR / filename
        local_path.write_text(content, encoding="utf-8")
        return str(local_path)

    def upload_session_json(
        self,
        *,
        container: str,
        folder: str | None,
        filename: str,
        payload: dict,
    ) -> dict:
        blob_name = self._build_blob_name(folder, filename)

        if not self.client:
            local_filename = blob_name.replace("/", "__")
            local_path = EXPORT_DIR / local_filename
            local_path.parent.mkdir(parents=True, exist_ok=True)
            local_path.write_text(
                json.dumps(payload, indent=2, ensure_ascii=False),
                encoding="utf-8",
            )
            return {"blob_name": blob_name, "url": None}

        self._ensure_container(container)
        container_client = self.client.get_container_client(container)
        blob_client = container_client.get_blob_client(blob_name)

        data = json.dumps(payload, indent=2, ensure_ascii=False).encode("utf-8")
        blob_client.upload_blob(data, overwrite=True)

        return {"blob_name": blob_name, "url": blob_client.url}

    def list_session_files(self, *, container: str, folder: str | None = None) -> list[str]:
        if not self.client:
            all_files: list[str] = []

            for path in EXPORT_DIR.iterdir():
                if path.is_file() and path.name.endswith(".json"):
                    blob_like_name = path.name.replace("__", "/")
                    all_files.append(blob_like_name)

            all_files = sorted(all_files)

            if folder:
                prefix = folder.strip().strip("/") + "/"
                return [name for name in all_files if name.startswith(prefix)]

            return all_files

        container_client = self.client.get_container_client(container)

        prefix = None
        if folder:
            prefix = folder.strip().strip("/") + "/"

        blobs = container_client.list_blobs(name_starts_with=prefix)
        names = [blob.name for blob in blobs if blob.name.endswith(".json")]
        return sorted(names)

    def download_session_json(self, *, container: str, blob_name: str) -> dict:
        if not self.client:
            local_filename = blob_name.replace("/", "__")
            local_path = EXPORT_DIR / local_filename
            return json.loads(local_path.read_text(encoding="utf-8"))

        container_client = self.client.get_container_client(container)
        blob_client = container_client.get_blob_client(blob_name)
        data = blob_client.download_blob().readall()
        return json.loads(data.decode("utf-8"))

    def upload_binary_file(
        self,
        *,
        container: str,
        folder: str | None,
        filename: str,
        data: bytes,
        content_type: str,
    ) -> dict:
        blob_name = self._build_blob_name(folder, filename)

        if not self.client:
            local_filename = blob_name.replace("/", "__")
            local_path = EXPORT_DIR / local_filename
            local_path.parent.mkdir(parents=True, exist_ok=True)
            local_path.write_bytes(data)
            return {"blob_name": blob_name, "url": None}

        self._ensure_container(container)
        container_client = self.client.get_container_client(container)
        blob_client = container_client.get_blob_client(blob_name)

        blob_client.upload_blob(
            data,
            overwrite=True,
            content_type=content_type,
        )

        return {"blob_name": blob_name, "url": blob_client.url}