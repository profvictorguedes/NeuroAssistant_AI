from pathlib import Path
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_export_markdown_success():
    payload = {
        "filename": "test-output",
        "content": "# NeuroAssistant AI\n\nThis is a test export."
    }

    response = client.post("/api/v1/files/export", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["download_name"].endswith(".md")

    # Clean up artifact written to disk during the test
    artifact = Path(body["download_name"])
    if artifact.exists():
        artifact.unlink()