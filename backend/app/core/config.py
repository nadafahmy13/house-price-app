"""
Application settings, loaded from environment variables / a .env file.

Uses pydantic-settings so all configuration is validated and typed, instead of reading
os.environ directly all over the codebase.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # General
    app_name: str = "House Price Prediction API"
    app_version: str = "1.0.0"

    # Path to the trained model pickle (relative to the backend/ folder, or absolute)
    model_path: str = "models/house_price.pkl"

    # Path to the JSON file listing the locations the model was trained on
    locations_path: str = "models/locations.json"

    # Comma-separated list of origins allowed to call this API (CORS)
    cors_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore", protected_namespaces=())

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
