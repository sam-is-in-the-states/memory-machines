import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    groq_api_key: str
    deepgram_api_key: str
    deepgram_base_url: str
    app_name: str = "Real-Time Transcription API"
    debug: bool = True
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
    