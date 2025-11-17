"""
Configuration settings for Zephyr Analytics Backend
"""

from os.path import dirname, join
from typing import List
from pydantic_settings import BaseSettings

dotenv_path = join(dirname(__file__), '..', '.env')

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # App Settings
    APP_NAME: str = "Zephyr Analytics"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/test"
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    # API
    API_PREFIX: str = "/api"
    
    class Config:
        env_file = dotenv_path
        case_sensitive = True


settings = Settings()
