"""
Loads the trained model pipeline and runs predictions.

The pickle is a dict of the form {"model": <sklearn Pipeline>, "use_log_target": bool},
exported by the winning notebook (03_random_forest.ipynb). If use_log_target is True, the
model was trained on log1p(price) and predictions must be inverted with expm1.
"""
import joblib
import numpy as np
import pandas as pd

from app.core.config import settings


class ModelService:
    def __init__(self) -> None:
        self._model = None
        self._use_log_target = False

    def load(self) -> None:
        bundle = joblib.load(settings.model_path)
        self._model = bundle["model"]
        self._use_log_target = bundle["use_log_target"]

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    def predict(self, features: pd.DataFrame) -> float:
        if self._model is None:
            raise RuntimeError("Model is not loaded yet")

        raw_prediction = self._model.predict(features)[0]
        prediction = np.expm1(raw_prediction) if self._use_log_target else raw_prediction
        return float(prediction)


# Single shared instance, loaded once at app startup (see app/main.py lifespan)
model_service = ModelService()
