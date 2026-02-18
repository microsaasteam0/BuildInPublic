from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict
from sqlalchemy.orm import Session

import os
import re
import json
import time
import requests
import httpx

from dotenv import load_dotenv
from openai import OpenAI, AsyncOpenAI
import asyncio

from database import get_db
from auth import get_current_active_user
from models import User, ContentGeneration, UsageStats
from feature_gates import get_feature_gate

from utils import (
    clean_twitter_thread,
    clean_linkedin_post,
    clean_instagram_slides
)

# ----------------------------------------------------
# Router Setup
# ----------------------------------------------------
snippetstream_router = APIRouter()
load_dotenv()

# ----------------------------------------------------
# Request + Response Models
# ----------------------------------------------------
class ContentRequest(BaseModel):
    content: Optional[str] = None
    url: Optional[HttpUrl] = None
    content_type: str = "markdown"

    browser_info: Optional[Dict] = None
    session_id: Optional[str] = None
    timezone: Optional[str] = None
    screen_resolution: Optional[str] = None
    context: Optional[Dict] = None
    enabled_platforms: Optional[List[str]] = ["twitter", "linkedin", "instagram"]


class SocialMediaResponse(BaseModel):
    twitter_thread: List[str]
    linkedin_post: str
    instagram_carousel: List[str]
    original_content_preview: str


# ----------------------------------------------------
# Pollinations Client Setup
# ----------------------------------------------------
client = None


async_client = None


def initialize_client():
    global client, async_client

    if client is None:
        print("🔧 Initializing Pollinations Client...")
        api_key = os.getenv("POLLINATIONS_API_KEY")
        if not api_key:
            raise Exception("❌ POLLINATIONS_API_KEY missing in environment")

        http_client = httpx.Client(timeout=60, verify=False)
        client = OpenAI(
            api_key=api_key,
            base_url="https://gen.pollinations.ai/v1",
            http_client=http_client
        )
        
        # Async client for parallel requests
        async_http_client = httpx.AsyncClient(timeout=60, verify=False)
        async_client = AsyncOpenAI(
            api_key=api_key,
            base_url="https://gen.pollinations.ai/v1",
            http_client=async_http_client
        )

        print("✅ Connected to Pollinations API (Sync + Async)")


# ----------------------------------------------------
# Async Safe Completion Wrapper
# ----------------------------------------------------
async def safe_completion_async(messages, max_tokens=2000):
    global async_client
    if async_client is None:
        initialize_client()

    # Prioritize Mistral for speed and reliability
    models_to_try = ["mistral", "openai", "searchgpt"]
    
    for model_name in models_to_try:
        for attempt in range(2): 
            try:
                response = await async_client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=0.7,
                )

                if not response.choices:
                    continue

                content = response.choices[0].message.content

                if not content:
                    print(f"⚠️ Model {model_name} (attempt {attempt+1}) returned EMPTY content.")
                    continue

                print(f"✅ Generated content using {model_name}")
                return content.strip()

            except Exception as e:
                print(f"❌ Pollinations {model_name} attempt {attempt+1} failed: {str(e)}")
                await asyncio.sleep(0.5)

    return None


# ----------------------------------------------------
# URL Content Fetcher (Advanced)
# ----------------------------------------------------
def fetch_content_from_url(url: str) -> str:
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, timeout=10, headers=headers)
        response.raise_for_status()

        from bs4 import BeautifulSoup
        soup = BeautifulSoup(response.text, "html.parser")

        # Remove junk
        for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
            tag.decompose()

        # Extract main content
        main = soup.find("article") or soup.find("main") or soup.find("div", class_="content")

        text = main.get_text(" ", strip=True) if main else soup.get_text(" ", strip=True)

        return text[:15000]

    except ImportError:
        # Fallback if bs4 is missing
        content = re.sub(r'<[^>]+>', ' ', response.text)
        content = re.sub(r'\s+', ' ', content).strip()
        return content[:15000]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch content: {str(e)}")


# ----------------------------------------------------
# Twitter Thread Generator (Async)
# ----------------------------------------------------
# ----------------------------------------------------
# Twitter Thread Generator (Async)
# ----------------------------------------------------
async def create_twitter_thread_async(content: str, context: Optional[Dict] = None) -> List[str]:

    system_prompt = """
You are a "Build in Public" expert for founders.

Your goal is to take a founder's daily update (Morning Plans + Evening Reflection) and turn it into a viral "Building in Public" Twitter thread.

Input Interpretation:
- Tasks marked with [x] in the Morning Plan are COMPLETED.
- Tasks marked with [ ] in the Morning Plan are UNFINISHED or delayed.
- Use the Evening Reflection to add color, struggle, and emotional depth to these tasks.

Thread Structure:
1/10 The Hook: Start with the biggest challenge or win of the day. "I almost quit today..." or "Finally cracked the code on..."
2/10 Context: What were you trying to build? (From morning plans)
3/10 The Struggle: What went wrong? (From evening reflection)
4/10 The Pivot/Fix: How did you solve it?
5/10 Technical/Business Insight: A specific lesson learned.
6/10 The Result: What did you ship? (Highlight completed [x] tasks)
7/10 Behind the Scenes: A raw, honest moment regarding the unfinished [ ] tasks.
8/10 Why it matters: The bigger vision.
9/10 What's next: Tomorrow's goal.
10/10 Call-to-action: "Follow along as I build [Product Name]"

Rules:
- Be RAW and HONEST. Founders love vulnerability.
- Use short, punchy sentences.
- No corporate jargon. Speak like a hacker/maker.
- Each tweet starts with "1/10", "2/10", etc.
- Max 1 emoji per tweet.
- Return ONLY the 10 tweets.

If the input is just a general topic, write a thread about "Why building [Topic] in public is hard but worth it."
"""

    if context:
        system_prompt += f"\n\nPersonalization Context:\n"
        if context.get('audience'): system_prompt += f"- Audience: {context['audience']}\n"
        if context.get('tone'): system_prompt += f"- Tone: {context['tone']}\n"
        if context.get('mood'): system_prompt += f"- Mood: {context['mood']}\n"
        # ... (keep existing context checks)

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": content}
    ]

    result = await safe_completion_async(messages, max_tokens=2000)

    if not result:
        return ["❌ Twitter generation failed"]

    posts = [line.strip() for line in result.split("\n") if line.strip()]

    # Ensure exactly 10 posts (simple validation)
    while len(posts) < 10:
        posts.append(f"{len(posts)+1}/10 🚀 Building in public is a journey. Keep shipping. #BuildInPublic")

    return posts[:10]


# ----------------------------------------------------
# LinkedIn Post Generator (Async)
# ----------------------------------------------------
async def create_linkedin_post_async(content: str, context: Optional[Dict] = None) -> str:

    system_prompt = """
You are a "Build in Public" strategist for LinkedIn.

Take the founder's daily log (Morning Plans + Evening Reflection) and write a high-engagement LinkedIn post.

Input Interpretation:
- Tasks marked with [x] in the Morning Plan are COMPLETED.
- Tasks marked with [ ] in the Morning Plan are UNFINISHED or delayed.
- Use the Evening Reflection to add color, struggle, and emotional depth.

Structure:
1. The Hook: A strong statement about the reality of building a startup.
2. The Story: "Today I planned to X, but Y happened. I managed to finish [X-task] but [Y-task] is still haunting me."
3. The Lesson: 3 bullet points on what you learned from BOTH the wins and the unfinished business.
4. The Takeaway: Advice for other founders on managing expectations.
5. Engagement: "How do you handle unfinished tasks?"

Formatting Rules:
- Use short paragraphs (1-2 lines).
- 3 Bullet points for the lesson.
- No hashtags in the body (only 3 at the end).
- Tone: Professional but authentic/vulnerable.

Input Content:
"""

    if context:
         # ... (keep existing context checks)
         pass

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": content}
    ]

    result = await safe_completion_async(messages, max_tokens=1500)

    if not result:
        return "❌ LinkedIn generation failed"

    return result


# ----------------------------------------------------
# Instagram Carousel Generator (Async)
# ----------------------------------------------------
async def create_instagram_carousel_async(content: str, context: Optional[Dict] = None) -> List[str]:

    system_prompt = """
You are a visual storyteller for founders.
Create 8 slides for an Instagram Carousel about "A Day in the Life of a Founder".

Input Interpretation:
- Tasks marked with [x] in the Morning Plan are COMPLETED.
- Tasks marked with [ ] in the Morning Plan are UNFINISHED or delayed.

Structure:
Slide 1: Title (Highlight the main finished or unfinished task)
Slide 2: The Plan (Initial to-do list)
Slide 3: The Reality (What actually got checked off [x])
Slide 4: The Challenge (The tasks that stayed [ ])
Slide 5: The Fix (How you handled the pivot)
Slide 6: The Lesson
Slide 7: The Result
Slide 8: Question for you

Format:
- Each slide has 2 lines:
  Line 1: EMOJI + TITLE (Uppercase)
  Line 2: Short description

Strictly return ONLY the slides separated by blank lines.
"""

    if context:
        # ... (keep existing context checks)
        pass

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": content}
    ]

    result = await safe_completion_async(messages, max_tokens=1500)

    if not result:
        return ["❌ Carousel generation failed"]

    raw_slides = result.split("\n\n")
    slides = [s.strip() for s in raw_slides if len(s.strip().split("\n")) >= 2]
    
    # Pad if needed
    while len(slides) < 8:
         slides.append(f"🚀 KEEP BUILDING\nConsistency is key")

    return slides[:8]


# ----------------------------------------------------
# Main Repurpose Endpoint (Full)
# ----------------------------------------------------
@snippetstream_router.post("/repurpose", response_model=SocialMediaResponse)
async def repurpose_content(
    request: ContentRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):

    try:
        feature_gate = get_feature_gate(current_user)

        # Generation limit check
        if not feature_gate.can_generate_content(db):
            raise HTTPException(status_code=429, detail="Daily generation limit reached")

        # URL is Pro-only
        if request.url and not feature_gate.can_process_urls():
            raise HTTPException(status_code=403, detail="URL processing is Pro feature")

        # Content input
        if request.url:
            content = fetch_content_from_url(str(request.url))
            source = "url"
        elif request.content:
            content = request.content
            source = "text"
        else:
            raise HTTPException(status_code=400, detail="Content or URL required")

        if not content or len(content.strip()) < 10:
            raise HTTPException(status_code=400, detail="Content is too short or empty")

        # Content length limit
        max_length = feature_gate.get_feature_limits(db)["max_content_length"]
        if len(content) > max_length:
            print(f"✂️ Truncating content from {len(content)} to {max_length}")
            content = content[:max_length] + "..."

        preview = content[:200] + "..." if len(content) > 200 else content

        print(f"🚀 Processing repurpose request for user {current_user.id} (Source: {source}, Length: {len(content)})")
        start_time = time.time()

        # Generate all outputs in parallel for maximum speed
        print("⚡ Triggering parallel generation for all platforms...")
        
        # Determine which tasks to run based on enabled_platforms
        enabled = request.enabled_platforms or ["twitter", "linkedin", "instagram"]
        
        tasks = []
        task_names = []
        
        if "twitter" in enabled or "x" in enabled:
            tasks.append(create_twitter_thread_async(content, request.context))
            task_names.append("twitter")
        
        if "linkedin" in enabled:
            tasks.append(create_linkedin_post_async(content, request.context))
            task_names.append("linkedin")
            
        if "instagram" in enabled:
            tasks.append(create_instagram_carousel_async(content, request.context))
            task_names.append("instagram")
        
        if not tasks:
            raise HTTPException(status_code=400, detail="At least one platform must be selected")
            
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Unpack results and handle potential errors
        raw_twitter = []
        raw_linkedin = ""
        raw_instagram = []
        
        for i, name in enumerate(task_names):
            res = results[i]
            if isinstance(res, Exception):
                print(f"❌ {name} generation error: {res}")
                if name == "twitter": raw_twitter = ["❌ Twitter error"]
                elif name == "linkedin": raw_linkedin = "❌ LinkedIn error"
                elif name == "instagram": raw_instagram = ["❌ Instagram error"]
            else:
                if name == "twitter": raw_twitter = res
                elif name == "linkedin": raw_linkedin = res
                elif name == "instagram": raw_instagram = res
        
        # Clean results
        twitter_thread = clean_twitter_thread(raw_twitter)
        linkedin_post = clean_linkedin_post(raw_linkedin)
        instagram_carousel = clean_instagram_slides(raw_instagram)

        processing_time = time.time() - start_time

        # Save generation
        try:
            generation = ContentGeneration(
                user_id=current_user.id,
                original_content=content[:1000],
                content_source=source,
                twitter_thread=json.dumps(twitter_thread),
                linkedin_post=linkedin_post,
                instagram_carousel=json.dumps(instagram_carousel),
                context=json.dumps(request.context) if request.context else None,
                processing_time=processing_time,
            )
            db.add(generation)

            usage = UsageStats(
                user_id=current_user.id,
                action="generate",
                extra_data=json.dumps(
                    {"source": source, "processing_time": processing_time}
                ),
            )
            db.add(usage)

            db.commit()

        except Exception as db_error:
            print("⚠️ Database save failed:", db_error)
            db.rollback()

        return SocialMediaResponse(
            twitter_thread=twitter_thread,
            linkedin_post=linkedin_post,
            instagram_carousel=instagram_carousel,
            original_content_preview=preview,
        )

    except HTTPException:
        # Re-raise HTTP exceptions (429, 403, etc)
        raise
    except Exception as e:
        import traceback
        print(f"❌ Error in repurpose_content: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e) or type(e).__name__}")


# ----------------------------------------------------
# Analytics Endpoint
# ----------------------------------------------------
@snippetstream_router.post("/analytics/track")
async def track_usage(
    data: dict,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Track user interactions for analytics"""
    try:
        usage_stat = UsageStats(
            user_id=current_user.id,
            action=data.get("action", "unknown"),
            platform=data.get("platform"),
            extra_data=json.dumps(data)
        )
        db.add(usage_stat)
        db.commit()

        return {"status": "tracked"}
    except Exception as e:
        print(f"⚠️ Analytics tracking failed: {e}")
        return {"status": "error", "message": str(e)}


# ----------------------------------------------------
# Health Endpoint
# ----------------------------------------------------
@snippetstream_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "SnippetStream"}
