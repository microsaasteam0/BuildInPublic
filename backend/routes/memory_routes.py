from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from auth import get_current_active_user
from models import User, UserMemory
import json

memory_router = APIRouter()

class MemoryUpdate(BaseModel):
    content: str

class MemoryResponse(BaseModel):
    content: str
    updated_at: Optional[str]

@memory_router.get("/", response_model=MemoryResponse)
async def get_memory(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get the user's AI memory"""
    if not current_user.is_premium:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="AI Memory is a Pro feature. Please upgrade to access."
        )
    memory = db.query(UserMemory).filter(UserMemory.user_id == current_user.id).first()
    if not memory:
        return MemoryResponse(content="", updated_at=None)
    
    return MemoryResponse(
        content=memory.memory_content,
        updated_at=memory.updated_at.isoformat() if memory.updated_at else memory.created_at.isoformat()
    )

@memory_router.put("/", response_model=MemoryResponse)
async def update_memory(
    request: MemoryUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update the user's AI memory"""
    if not current_user.is_premium:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="AI Memory is a Pro feature. Please upgrade to access."
        )
    memory = db.query(UserMemory).filter(UserMemory.user_id == current_user.id).first()
    
    if memory:
        memory.memory_content = request.content
    else:
        memory = UserMemory(
            user_id=current_user.id,
            memory_content=request.content
        )
        db.add(memory)
    
    db.commit()
    db.refresh(memory)
    
    return MemoryResponse(
        content=memory.memory_content,
        updated_at=memory.updated_at.isoformat() if memory.updated_at else memory.created_at.isoformat()
    )
