"""
ai_engine/whisper_service.py — Audio transcription using Gemini (replaces OpenAI Whisper)

Gemini 2.5 Flash accepts audio directly, so we upload the file inline as base64.
No OpenAI API key needed — uses the same GEMINI_API_KEY already in your .env
"""

import os
import base64
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))


def transcribe_audio(audio_file):
    """
    Accepts a Django InMemoryUploadedFile (from request.FILES),
    sends it to Gemini for transcription, returns:
      {"transcript": "...", "detected_language": "tamil"}
    """
    try:
        # Read the audio bytes and encode as base64
        audio_bytes = audio_file.read()
        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")

        # Determine MIME type — expo-av records as m4a on iOS, mp4/aac on Android
        # We'll accept whatever comes and let Gemini figure it out
        content_type = getattr(audio_file, "content_type", None) or "audio/mp4"

        model = genai.GenerativeModel("gemini-2.5-flash")

        response = model.generate_content([
            {
                "inline_data": {
                    "mime_type": content_type,
                    "data": audio_b64,
                }
            },
            (
                "Please transcribe this audio exactly as spoken. "
                "The speaker is likely speaking Tamil or Tamil mixed with English. "
                "Output only the transcription text, nothing else — no labels, "
                "no explanations, no language notes."
            ),
        ])

        transcript = response.text.strip()
        return {
            "transcript": transcript,
            "detected_language": "tamil",
        }

    except Exception as e:
        return {
            "error": str(e),
            "transcript": "",
            "detected_language": "tamil",
        }