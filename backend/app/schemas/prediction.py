"""
Request / response schemas for the /predict endpoint.

These mirror the feature set the model was trained on in
notebooks/03_random_forest.ipynb (the winning model — see the project README for the
model comparison table).
"""
from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    location: str = Field(..., description="City/location, e.g. 'mumbai'. Unknown values are mapped to 'other'.")
    carpet_area_sqft: float = Field(..., gt=0, description="Carpet (or super) area in square feet")
    floor_num: int = Field(..., ge=-1, description="Floor number. Ground = 0, Basement = -1")
    bathroom: int = Field(..., ge=0, description="Number of bathrooms")
    balcony: int = Field(..., ge=0, description="Number of balconies")
    car_parking: int = Field(0, ge=0, description="Number of car parking spots")
    furnishing: str = Field(..., description="'Furnished' | 'Semi-Furnished' | 'Unfurnished'")
    transaction: str = Field(..., description="'New Property' | 'Resale' | 'Rent/Lease' | 'Other'")
    status: str = Field("Ready to Move", description="Construction status, e.g. 'Ready to Move'")
    facing: str = Field(..., description="Facing direction, e.g. 'East', 'North - West'")

    model_config = {
        "json_schema_extra": {
            "example": {
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
        }
    }


class PredictionResponse(BaseModel):
    predicted_price: float = Field(..., description="Predicted price in INR")


class HealthResponse(BaseModel):
    status: str = "ok"
