from groq import Groq
import json
from app.config import get_settings

class GroqService:
    def __init__(self):
        settings = get_settings()
        self.client = Groq(api_key=settings.groq_api_key)
        self.model = "llama-3.3-70b-versatile"
    
    def analyze_text(self, text: str) -> dict:
        """
        Analyze text using Groq API to extract sentiment, keywords, and emotion.
        
        Args:
            text: The text to analyze
            
        Returns:
            Dictionary containing sentiment, sentiment_label, keywords, and emotion
        """
        prompt = self._build_prompt(text)
        
        try:
            response = self._call_groq_api(prompt)
            result = self._parse_response(response)
            return self._validate_result(result)
        except Exception as e:
            print(f"Error in Groq analysis: {str(e)}")
            return self._get_default_result()
    
    def _build_prompt(self, text: str) -> str:
        """Build the prompt for Groq API."""
        return f"""Analyze the following text and extract sentiment and key topics.

        Text: "{text}"

        Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just the JSON):
        {{
            "sentiment": <float between 0.0 and 1.0, where 0 is very negative and 1 is very positive>,
            "sentiment_label": "<one of: very_negative, negative, neutral, positive, very_positive>",
            "keywords": [<array of 3-6 most important keywords or topics from the text>],
            "emotion": "<primary emotion detected: joy, sadness, anger, fear, surprise, or neutral>"
        }}"""
    
    def _call_groq_api(self, prompt: str) -> str:
        """Make API call to Groq."""
        chat_completion = self.client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a sentiment analysis expert. Always respond with valid JSON only, no markdown formatting."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model=self.model,
            temperature=0.3,
            max_tokens=500,
        )
        return chat_completion.choices[0].message.content.strip()
    
    def _parse_response(self, response_text: str) -> dict:
        """Parse and clean the response from Groq API."""
        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()
        
        try:
            return json.loads(response_text)
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            print(f"Response text: {response_text}")
            return self._get_default_result()
    
    def _validate_result(self, result: dict) -> dict:
        """Validate and normalize the result."""
        processed_result = {
            "sentiment": float(result.get("sentiment", 0.5)),
            "sentiment_label": result.get("sentiment_label", "neutral"),
            "keywords": result.get("keywords", ["processing"]),
            "emotion": result.get("emotion", "neutral")
        }
        
        # Ensure sentiment is between 0 and 1
        processed_result["sentiment"] = max(0.0, min(1.0, processed_result["sentiment"]))
        
        return processed_result
    
    def _get_default_result(self) -> dict:
        """Return default result when analysis fails."""
        return {
            "sentiment": 0.5,
            "sentiment_label": "neutral",
            "keywords": ["analysis", "pending"],
            "emotion": "neutral"
        }
