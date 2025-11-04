import os
import json
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.llm_key = os.getenv("EMERGENT_LLM_KEY")
        self.chat = None
        
        # Initialize LLM client if key is available
        if self.llm_key:
            try:
                from emergentintegrations.llm.chat import LlmChat
                # Initialize with default system message
                self.chat = LlmChat(
                    api_key=self.llm_key,
                    session_id="dating-app-ai",
                    system_message="You are a helpful AI assistant for a dating app. Provide friendly, engaging, and appropriate responses."
                ).with_model("openai", "gpt-4o-mini")
                print("✅ AI Service initialized with Emergent LLM (gpt-4o-mini)")
            except Exception as e:
                print(f"⚠️ AI Service initialization error: {e}")
    
    async def calculate_compatibility(self, user1_interests: List[str], user2_interests: List[str], 
                                     user1_bio: str = "", user2_bio: str = "") -> int:
        """Calculate compatibility score between two users (0-100%)"""
        
        # Basic calculation based on common interests
        if not user1_interests or not user2_interests:
            return 0
        
        common_interests = set(user1_interests) & set(user2_interests)
        total_interests = set(user1_interests) | set(user2_interests)
        
        if not total_interests:
            return 0
        
        # Jaccard similarity
        basic_score = (len(common_interests) / len(total_interests)) * 100
        
        # If AI is available, enhance with semantic analysis
        if self.client and user1_bio and user2_bio:
            try:
                ai_score = await self._ai_compatibility_analysis(user1_bio, user2_bio, 
                                                                 list(common_interests))
                # Weighted average: 60% interests, 40% AI analysis
                final_score = (basic_score * 0.6) + (ai_score * 0.4)
                return int(final_score)
            except:
                pass
        
        return int(basic_score)
    
    async def _ai_compatibility_analysis(self, bio1: str, bio2: str, 
                                        common_interests: List[str]) -> int:
        """Use AI to analyze compatibility based on bios"""
        try:
            from emergentintegrations.llm.chat import UserMessage
            
            prompt = f"""Analyze compatibility between two dating app users based on their bios and common interests.
            
User 1 Bio: {bio1}
User 2 Bio: {bio2}
Common Interests: {', '.join(common_interests)}
            
Provide a compatibility score from 0-100 considering:
- Personality compatibility
- Life goals alignment
- Communication style
- Shared values
            
Return ONLY a number between 0-100."""
            
            message = UserMessage(text=prompt)
            response = await self.chat.send_message(message)
            
            score_text = response
            score = int(''.join(filter(str.isdigit, score_text)))
            return max(0, min(100, score))
        except Exception as e:
            print(f"AI compatibility error: {e}")
            return 50  # Default moderate compatibility
    
    async def generate_icebreaker(self, matched_user_profile: Dict) -> str:
        """Generate conversation starter based on matched user's profile"""
        
        interests = matched_user_profile.get("interests", [])
        bio = matched_user_profile.get("bio", "")
        job = matched_user_profile.get("job_title", "")
        
        if not self.chat:
            # Fallback icebreakers
            if interests:
                return f"Заметил, что ты увлекаешься {interests[0]}! Что тебя в этом привлекло?"
            return "Привет! Как прошла неделя?"
        
        try:
            from emergentintegrations.llm.chat import UserMessage
            
            prompt = f"""Generate a friendly, natural conversation starter in Russian for a dating app match.
            
Profile Info:
- Interests: {', '.join(interests)}
- Bio: {bio}
- Job: {job}
            
Create ONE short, engaging question (max 15 words) that shows genuine interest.
Be casual, friendly, and specific to their profile.
Do not use emojis. Response must be in Russian."""
            
            message = UserMessage(text=prompt)
            response = await self.chat.send_message(message)
            
            icebreaker = response.strip().strip('"')
            return icebreaker
        except Exception as e:
            print(f"AI icebreaker error: {e}")
            if interests:
                return f"Заметил, что ты увлекаешься {interests[0]}! Что тебя в этом привлекло?"
            return "Привет! Как прошла неделя?"
    
    async def moderate_content(self, content: str, content_type: str = "text") -> Dict:
        """Moderate user-generated content for inappropriate material"""
        
        if not self.chat:
            # Basic keyword filtering
            inappropriate_keywords = ["spam", "scam", "fake", "bot"]
            is_flagged = any(keyword in content.lower() for keyword in inappropriate_keywords)
            return {"is_safe": not is_flagged, "reason": "keyword_filter"}
        
        try:
            from emergentintegrations.llm.chat import UserMessage
            
            prompt = f"""Analyze this {content_type} for dating app safety.
            
Content: {content}
            
Check for:
- Explicit sexual content
- Harassment or hate speech
- Spam or scams
- Personal contact info (phone, email)
- Violent content
            
Respond with JSON: {{"is_safe": true/false, "reason": "description"}}"""
            
            message = UserMessage(text=prompt)
            response = await self.chat.send_message(message)
            
            result = json.loads(response)
            return result
        except Exception as e:
            print(f"AI moderation error: {e}")
            return {"is_safe": True, "reason": "moderation_unavailable"}

# Global AI service instance
ai_service = AIService()
