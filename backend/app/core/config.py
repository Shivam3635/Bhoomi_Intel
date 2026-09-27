import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "BHUMI-INTEL"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "bhumi-intel-secure-jwt-secret-key-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Mode
    DEMO_MODE: bool = True
    
    # Database
    # Support SQLite fallback or PostgreSQL/PostGIS
    DATABASE_URL: str = "sqlite:///./bhumi_intel.db"
    POSTGRES_USER: Optional[str] = "bhumi_user"
    POSTGRES_PASSWORD: Optional[str] = "bhumi_password"
    POSTGRES_DB: Optional[str] = "bhumi_db"
    POSTGRES_HOST: Optional[str] = "localhost"
    POSTGRES_PORT: Optional[str] = "5432"

    # Elasticsearch
    ELASTICSEARCH_URL: Optional[str] = "http://localhost:9200"
    ELASTICSEARCH_ENABLED: bool = False
    
    # GeoServer
    GEOSERVER_URL: Optional[str] = "http://localhost:8080/geoserver"
    GEOSERVER_ENABLED: bool = False
    
    # LLM Settings (OpenAI / Gemini / Anthropic / Local Fallback)
    LLM_PROVIDER: str = "fallback"  # "fallback", "gemini", "openai"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000", "*"]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
