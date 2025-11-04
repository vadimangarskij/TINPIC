import os
import json
from typing import List, Dict, Optional

class AIService:
    def __init__(self):
        self.llm_key = os.getenv("EMERGENT_LLM_KEY")
        self.client = None
        
        # Initialize LLM client if key is available
        if self.llm_key:
            try:
                from emergentintegrations import LLMClient
                self.client = LLMClient(api_key=self.llm_key)
                print("✅ AI Service initialized with Emergent LLM")
            except Exception as e:
                print(f"⚠️ AI Service: {e}")
    
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
            
            response = self.client.chat_completion(
                messages=[{"role": "user", "content": prompt}],
                model="gpt-4",
                max_tokens=10
            )
            
            score_text = response.get("choices", [{}])[0].get("message", {}).get("content", "50")
            score = int(''.join(filter(str.isdigit, score_text)))
            return max(0, min(100, score))
        except:
            return 50  # Default moderate compatibility
    
    async def generate_icebreaker(self, matched_user_profile: Dict) -> str:
        """Generate conversation starter based on matched user's profile"""
        
        interests = matched_user_profile.get("interests", [])
        bio = matched_user_profile.get("bio", "")
        job = matched_user_profile.get("job_title", "")
        
        if not self.client:
            # Fallback icebreakers
            if interests:
                return f"I noticed you're into {interests[0]}! What got you interested in that?"
            return "Hey! What's been the highlight of your week?"
        
        try:
            prompt = f"""Generate a friendly, natural conversation starter for a dating app match.
            
Profile Info:
- Interests: {', '.join(interests)}
- Bio: {bio}
- Job: {job}
            
Create ONE short, engaging question (max 15 words) that shows genuine interest.
Be casual, friendly, and specific to their profile.
Do not use emojis."""
            
            response = self.client.chat_completion(
                messages=[{"role": "user", "content": prompt}],
                model="gpt-4",
                max_tokens=50
            )
            
            icebreaker = response.get("choices", [{}])[0].get("message", {}).get("content", "")
            return icebreaker.strip().strip('"')
        except:
            if interests:
                return f"I noticed you're into {interests[0]}! What got you interested in that?"
            return "Hey! What's been the highlight of your week?"
    
    async def moderate_content(self, content: str, content_type: str = "text") -> Dict:
        """Moderate user-generated content for inappropriate material"""
        
        if not self.client:
            # Basic keyword filtering
            inappropriate_keywords = ["spam", "scam", "fake", "bot"]
            is_flagged = any(keyword in content.lower() for keyword in inappropriate_keywords)
            return {"is_safe": not is_flagged, "reason": "keyword_filter"}
        
        try:
            prompt = f"""Analyze this {content_type} for dating app safety.
            
Content: {content}
            
Check for:
- Explicit sexual content
- Harassment or hate speech
- Spam or scams
- Personal contact info (phone, email)
- Violent content
            
Respond with JSON: {{"is_safe": true/false, "reason": "description"}}"""
            
            response = self.client.chat_completion(
                messages=[{"role": "user", "content": prompt}],
                model="gpt-4",
                max_tokens=100
            )
            
            result_text = response.get("choices", [{}])[0].get("message", {}).get("content", "")
            result = json.loads(result_text)
            return result
        except:
            return {"is_safe": True, "reason": "moderation_unavailable"}

# Global AI service instance
ai_service = AIService()
