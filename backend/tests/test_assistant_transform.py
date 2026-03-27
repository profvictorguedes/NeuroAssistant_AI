from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_assistant_transform_success():
    payload = {
        "mode": "simplify",
        "text": "I need to review three documents, identify the top risks, create a short summary, and send it before tomorrow, but I feel overwhelmed.",
        "preferences": {
            "output_style": "balanced",
            "visual_chunking": True,
            "bullet_steps": True,
            "calming_tone": True,
            "deadline_aware": False,
            "beginner_friendly": True
        }
    }

    response = client.post("/api/v1/assistant/transform", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert "result" in body
    assert "title" in body["result"]
    assert "transformed_text" in body["result"]
    assert isinstance(body["result"]["next_actions"], list)