from pydantic import BaseModel, Field

class TranscriptRequest(BaseModel):
    text: str = Field(..., min_length=1, description="The transcript text to process")

class ProcessedResponse(BaseModel):
    sentiment: float = Field(..., ge=0.0, le=1.0, description="Sentiment score between 0 and 1")
    sentiment_label: str = Field(..., description="Sentiment label")
    keywords: list[str] = Field(..., description="List of keywords extracted from text")
    emotion: str = Field(..., description="Primary emotion detected")

class DeepgramKeyResponse(BaseModel):
    api_key: str
    