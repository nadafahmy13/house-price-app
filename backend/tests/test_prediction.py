import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="module")
def client():
    # Using TestClient as a context manager triggers the app's lifespan (startup/shutdown),
    # which is what actually loads the model.
    with TestClient(app) as c:
        yield c


VALID_PAYLOAD = {
    "location": "mumbai",
    "carpet_area_sqft": 950,
    "floor_num": 4,
    "bathroom": 2,
    "balcony": 1,
    "car_parking": 1,
    "furnishing": "Semi-Furnished",
    "transaction": "Resale",
    "status": "Ready to Move",
    "facing": "East",
}


def test_health(client) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_predict_happy_path(client) -> None:
    response = client.post("/predict", json=VALID_PAYLOAD)
    assert response.status_code == 200
    body = response.json()
    assert "predicted_price" in body
    assert body["predicted_price"] > 0


def test_predict_unknown_location_falls_back_to_other(client) -> None:
    payload = {**VALID_PAYLOAD, "location": "some-unseen-city"}
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    assert response.json()["predicted_price"] > 0


def test_predict_invalid_input_returns_422(client) -> None:
    # Missing required fields entirely
    response = client.post("/predict", json={"location": "mumbai"})
    assert response.status_code == 422


def test_predict_negative_area_returns_422(client) -> None:
    payload = {**VALID_PAYLOAD, "carpet_area_sqft": -100}
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
