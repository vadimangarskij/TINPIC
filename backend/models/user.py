from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

class GenderEnum(str, Enum):
    male = "male"
    female = "female"
    other = "other"

class LookingForEnum(str, Enum):
    relationship = "relationship"
    friendship = "friendship"
    casual = "casual"
    not_sure = "not_sure"

class LifestyleEnum(str, Enum):
    never = "never"
    socially = "socially"
    regularly = "regularly"
    prefer_not_say = "prefer_not_say"

class ExerciseEnum(str, Enum):
    never = "never"
    sometimes = "sometimes"
    regularly = "regularly"
    very_active = "very_active"

class PetsEnum(str, Enum):
    none = "none"
    dog = "dog"
    cat = "cat"
    other = "other"
    love_pets = "love_pets"

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[GenderEnum] = None
    bio: Optional[str] = None
    
class UserCreate(UserBase):
    password: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    id: str
    email: str
    username: str
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    bio: Optional[str] = None
    photos: List[dict] = []
    interests: List[str] = []
    city: Optional[str] = None
    job_title: Optional[str] = None
    company: Optional[str] = None
    education: Optional[str] = None
    height: Optional[int] = None
    smoking: Optional[str] = None
    drinking: Optional[str] = None
    pets: Optional[str] = None
    exercise: Optional[str] = None
    looking_for: Optional[str] = None
    is_premium: bool = False
    is_verified: bool = False
    coins: int = 0
    profile_theme: Optional[str] = None
    profile_badge: Optional[str] = None
    profile_frame: Optional[str] = None
    animated_avatar: Optional[str] = None
    total_matches: int = 0
    instagram: Optional[str] = None
    spotify: Optional[str] = None
    facebook: Optional[str] = None
    created_at: datetime
    
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[GenderEnum] = None
    interests: Optional[List[str]] = None
    job_title: Optional[str] = None
    company: Optional[str] = None
    education: Optional[str] = None
    height: Optional[int] = None
    smoking: Optional[LifestyleEnum] = None
    drinking: Optional[LifestyleEnum] = None
    pets: Optional[PetsEnum] = None
    exercise: Optional[ExerciseEnum] = None
    looking_for: Optional[LookingForEnum] = None
    instagram: Optional[str] = None
    spotify: Optional[str] = None
    facebook: Optional[str] = None

class UserPreferences(BaseModel):
    show_gender: Optional[str] = None
    min_age: int = 18
    max_age: int = 100
    max_distance: int = 100
    hide_online_status: bool = False
    hide_distance: bool = False
    hide_age: bool = False
    invisible_mode: bool = False

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float
    city: Optional[str] = None
    
    @validator('latitude')
    def validate_latitude(cls, v):
        if not -90 <= v <= 90:
            raise ValueError('Latitude must be between -90 and 90')
        return v
    
    @validator('longitude')
    def validate_longitude(cls, v):
        if not -180 <= v <= 180:
            raise ValueError('Longitude must be between -180 and 180')
        return v
