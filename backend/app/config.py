"""
Configuration settings for Zephyr Analytics Backend
"""

from typing import List
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
        case_sensitive=True,
    )
    
    # App Settings
    APP_NAME: str = "Zephyr Analytics"
    DEBUG: bool = False
    
    # Database (defaults to this if not in env)
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/test"
    
    # CORS``
    CORS_ORIGINS: List[str] = ["*"]
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    # API
    API_PREFIX: str = "/api"

settings = Settings()
