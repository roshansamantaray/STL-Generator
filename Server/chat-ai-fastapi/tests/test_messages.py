from fastapi.testclient import TestClient
from chat_ai_fastapi.main import app

client = TestClient(app)

def test_create_message():
    payload = {
        "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
        "request": "Hello",
        "response": "Hi there!",
        "error": None,
        "status": "success",
        "updated_timestamp": "2025-01-01T10:00:00Z"
    }
    response = client.post("/api/chat/messages", json=payload)
    assert response.status_code == 200
    assert response.json()["request"] == "Hello"

def test_get_messages():
    conversation_id = "550e8400-e29b-41d4-a716-446655440000"
    response = client.get(f"/api/chat/messages/{conversation_id}")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
