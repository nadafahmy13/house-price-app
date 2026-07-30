import logging

from fastapi import APIRouter

from app.schemas.prediction import HealthResponse, PredictionRequest, PredictionResponse
from app.services.inference import model_service
from app.services.preprocessing import request_to_dataframe

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["health"])
def health() -> HealthResponse:
    return HealthResponse(status="ok" if model_service.is_loaded else "model_not_loaded")


@router.post("/predict", response_model=PredictionResponse, tags=["prediction"])
def predict(payload: PredictionRequest) -> PredictionResponse:
    features = request_to_dataframe(payload)
    predicted_price = model_service.predict(features)
    logger.info("Prediction served: %s -> %.2f", payload.model_dump(), predicted_price)
    return PredictionResponse(predicted_price=predicted_price)
