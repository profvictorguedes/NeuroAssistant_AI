from pathlib import Path

EXPORT_DIR = Path("exports")
EXPORT_DIR.mkdir(exist_ok=True)


class AzureBlobService:
    def save_export(self, filename: str, content: str) -> str:
        local_path = EXPORT_DIR / filename
        local_path.write_text(content, encoding="utf-8")
        return str(local_path)