"""
Turns a validated PredictionRequest into a single-row pandas DataFrame with exactly the
column names used during training (see notebooks/03_random_forest.ipynb, section 2).

Because the exported model is a full scikit-learn Pipeline (imputation + scaling / one-hot
encoding + the regressor all bundled together), this function does NOT need to do any manual
encoding — it just has to line up the raw column names and map unknown locations to "other".
"""
import json
from functools import lru_cache

import pandas as pd

from app.core.config import settings
from app.schemas.prediction import PredictionRequest

# Column order must match numeric_features + categorical_features from the training notebooks
NUMERIC_FEATURES = ["carpet_area_sqft", "floor_num", "bathroom_num", "balcony_num", "car_parking_num"]
CATEGORICAL_FEATURES = ["location_grouped", "Furnishing", "Transaction", "Status", "facing"]


@lru_cache(maxsize=1)
def get_known_locations() -> set[str]:
    """Load the list of locations seen during training (for unknown-location mapping)."""
    with open(settings.locations_path) as f:
        return set(json.load(f))


def request_to_dataframe(payload: PredictionRequest) -> pd.DataFrame:
    known_locations = get_known_locations()
    location_grouped = payload.location if payload.location in known_locations else "other"

    row = {
        "carpet_area_sqft": payload.carpet_area_sqft,
        "floor_num": payload.floor_num,
        "bathroom_num": payload.bathroom,
        "balcony_num": payload.balcony,
        "car_parking_num": payload.car_parking,
        "location_grouped": location_grouped,
        "Furnishing": payload.furnishing,
        "Transaction": payload.transaction,
        "Status": payload.status,
        "facing": payload.facing,
    }

    return pd.DataFrame([row], columns=NUMERIC_FEATURES + CATEGORICAL_FEATURES)
