from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MessageCreate(BaseModel):
    match_id: str
    content: Optional[str] = None
    message_type: str = 'text'  # text, image, voice, video, gift
    media_url: Optional[str] = None
    gift_id: Optional[str] = None
    gift_cost: Optional[int] = None

class Message(BaseModel):
    id: str
    match_id: str
    sender_id: str
    content: Optional[str]
    message_type: str
    media_url: Optional[str] = None
    gift_id: Optional[str] = None
    is_read: bool
    sent_at: datetime

class MessageRead(BaseModel):
    message_ids: list[str]

class TypingIndicator(BaseModel):
    match_id: str
    is_typing: bool
