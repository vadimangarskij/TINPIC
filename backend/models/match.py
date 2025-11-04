from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SwipeAction(BaseModel):
    swiped_user_id: str
    action: str  # 'like', 'pass', 'super_like'

class Match(BaseModel):
    id: str
    user_id_1: str
    user_id_2: str
    created_at: datetime
    is_blocked: bool = False

class MatchWithProfile(BaseModel):
    match_id: str
    matched_user: dict
    created_at: datetime
    last_message: Optional[dict] = None
    unread_count: int = 0

class DiscoveryCard(BaseModel):
    id: str
    username: str
    full_name: Optional[str]
    age: Optional[int]
    bio: Optional[str]
    photos: List[dict]
    interests: List[str]
    distance: Optional[float] = None
    compatibility_score: Optional[int] = None
    job_title: Optional[str] = None
    education: Optional[str] = None
    is_verified: bool = False
    is_premium: bool = False
    profile_badge: Optional[str] = None
    profile_frame: Optional[str] = None
