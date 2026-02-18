from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
import requests

router = APIRouter(tags=["Support"])

SUPABASE_URL = "https://ldewwmfkymjmokopulys.supabase.co/functions/v1/submit-support"

class SupportRequest(BaseModel):
    product: str
    category: str
    message: str
    user_email: EmailStr
    metadata: dict | None = None

@router.post("/support")
def submit_support(payload: SupportRequest):
    # Retrieve secrets inside the function to ensure env is fully loaded
    form_secret = os.getenv("FORM_SECRET")
    
    if not form_secret:
        print("⚠️ Critical: FORM_SECRET is missing in backend environment variables.")
        raise HTTPException(
            status_code=500,
            detail="Server configuration error. Please try again later."
        )

    # Ensure payload is converted to dict correctly for the request (exclude None values)
    data = payload.dict(exclude_none=True)
    
    response = requests.post(
        SUPABASE_URL,
        headers={
            "Content-Type": "application/json",
            "x-form-secret": form_secret
        },
        json=data,
        timeout=10
    )

    if response.status_code == 429:
        raise HTTPException(
            status_code=429,
            detail="Too many submissions. Try again later."
        )

    if not response.ok:
        print(f"❌ Supabase Error ({response.status_code}): {response.text}")
        raise HTTPException(
            status_code=response.status_code,
            detail=response.text
        )

    return response.json()
