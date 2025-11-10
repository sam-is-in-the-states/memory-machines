from fastapi import APIRouter, HTTPException
from app.models.schemas import TranscriptRequest, ProcessedResponse, DeepgramKeyResponse
from app.services.groq_service import GroqService
from app.config import get_settings

router = APIRouter()
groq_service = GroqService()

@router.get("/")
async def root():
    return {"message": "Real-Time Transcription Backend API"}

@router.get("/health")
async def health_check():
    return {"status": "healthy"}

@router.post("/api/process_text", response_model=ProcessedResponse)
async def process_text(request: TranscriptRequest):
    """
    Process transcript text using Groq API to extract sentiment and keywords.
    """
    try:
        result = groq_service.analyze_text(request.text)
        return ProcessedResponse(**result)
    except Exception as e:
        print(f"Error processing text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing text: {str(e)}")

@router.get("/api/get-deepgram-key", response_model=DeepgramKeyResponse)
async def get_deepgram_key():
    """
    Return Deepgram API key for frontend to use.
    In production, you might want to implement more secure key management.
    """
    settings = get_settings()
    if not settings.deepgram_api_key:
        raise HTTPException(status_code=500, detail="Deepgram API key not configured")
    return DeepgramKeyResponse(api_key=settings.deepgram_api_key)