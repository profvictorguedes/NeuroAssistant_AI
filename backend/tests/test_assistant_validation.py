from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_assistant_transform_validation_error_for_short_text():
    payload = {
        "mode": "simplify",
        "text": "too short",
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

    assert response.status_code == 422