from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))


def match_schemes(transcript, craft, location, monthly_income, caste_category, language="Tamil"):
    prompt = f"""
You are a government scheme advisor for Indian artisans.
Respond ENTIRELY in {language} language. Every word in your response must be in {language} only.

Producer profile:
- Craft: {craft}
- Location: {location}
- Monthly Income: ₹{monthly_income}
- Caste Category: {caste_category}
- What they said: {transcript}

Return ONLY a JSON object, no extra text, no markdown:
{{
  "matched_schemes": [
    {{
      "name": "scheme name in {language}",
      "benefit": "what they get, written in {language}",
      "how_to_apply": "website or office, written in {language}"
    }}
  ],
  "recommended_platforms": ["platform1 in {language}", "platform2 in {language}"]
}}
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    text = response.text.strip().replace("```json", "").replace("```", "").strip()
    return json.loads(text)


def generate_listing(craft, description, price, location, language="Tamil"):
    prompt = f"""
You are a product listing writer for Indian handicrafts.
Respond ENTIRELY in {language} language. Every word must be in {language} only.

Product details:
- Craft: {craft}
- Description: {description}
- Price: ₹{price}
- Made in: {location}

Return ONLY a JSON object, no extra text, no markdown:
{{
  "listing": "product listing written entirely in {language}"
}}
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    text = response.text.strip().replace("```json", "").replace("```", "").strip()
    return json.loads(text)