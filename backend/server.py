from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import utilities and services
from utils.auth import (
    create_access_token, get_current_user, get_password_hash, verify_password
)
from utils.supabase_client import supabase, supabase_admin
from services.ai_service import ai_service
from services.payment_service import payment_service

# Import models
from models.user import (
    UserCreate, UserLogin, UserProfile, UserUpdate, 
    UserPreferences, LocationUpdate
)
from models.match import SwipeAction, DiscoveryCard, MatchWithProfile
from models.message import MessageCreate, Message, MessageRead

# Initialize FastAPI app
app = FastAPI(
    title="ConnectSphere API",
    description="Dating app API with AI-powered matching",
    version="1.0.0"
)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS[0] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# HEALTH CHECK
# ============================================

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "supabase_connected": supabase is not None,
        "ai_service_ready": ai_service.client is not None
    }

# ============================================
# AUTHENTICATION ENDPOINTS
# ============================================

@app.post("/api/auth/register")
async def register(user: UserCreate):
    """Register a new user"""
    try:
        if not supabase_admin:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        # Check if user exists
        existing = supabase_admin.table("users").select("id").eq("email", user.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check username
        existing_username = supabase_admin.table("users").select("id").eq("username", user.username).execute()
        if existing_username.data:
            raise HTTPException(status_code=400, detail="Username already taken")
        
        # Hash password
        hashed_password = get_password_hash(user.password)
        
        # Calculate age from date_of_birth
        age = None
        if user.date_of_birth:
            today = datetime.now().date()
            age = today.year - user.date_of_birth.year - (
                (today.month, today.day) < (user.date_of_birth.month, user.date_of_birth.day)
            )
        
        # Create user
        user_data = {
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "date_of_birth": str(user.date_of_birth) if user.date_of_birth else None,
            "age": age,
            "gender": user.gender,
            "bio": user.bio,
            "phone": user.phone,
            "is_approved": False,  # Requires admin approval
            "coins": 100  # Welcome bonus
        }
        
        result = supabase_admin.table("users").insert(user_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        user_id = result.data[0]["id"]
        
        # Create access token
        access_token = create_access_token(data={"sub": user_id})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": result.data[0]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    """Login user"""
    try:
        if not supabase_admin:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        # Find user
        result = supabase_admin.table("users").select("*").eq("email", credentials.email).execute()
        
        if not result.data:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        user = result.data[0]
        
        # Check if user is banned
        if user.get("is_banned"):
            raise HTTPException(status_code=403, detail="Account is banned")
        
        # Update last active
        supabase_admin.table("users").update({"last_active": datetime.now().isoformat()}).eq("id", user["id"]).execute()
        
        # Create access token
        access_token = create_access_token(data={"sub": user["id"]})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# USER PROFILE ENDPOINTS
# ============================================

@app.get("/api/users/me")
async def get_my_profile(current_user_id: str = Depends(get_current_user)):
    """Get current user's profile"""
    try:
        result = supabase_admin.table("users").select("*").eq("id", current_user_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/users/me")
async def update_my_profile(
    updates: UserUpdate,
    current_user_id: str = Depends(get_current_user)
):
    """Update current user's profile"""
    try:
        # Prepare update data
        update_data = updates.dict(exclude_unset=True)
        
        if "date_of_birth" in update_data and update_data["date_of_birth"]:
            # Calculate age
            dob = update_data["date_of_birth"]
            today = datetime.now().date()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            update_data["age"] = age
            update_data["date_of_birth"] = str(dob)
        
        update_data["updated_at"] = datetime.now().isoformat()
        
        result = supabase_admin.table("users").update(update_data).eq("id", current_user_id).execute()
        
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/users/location")
async def update_location(
    location: LocationUpdate,
    current_user_id: str = Depends(get_current_user)
):
    """Update user's location"""
    try:
        # PostGIS point format
        location_data = {
            "location": f"POINT({location.longitude} {location.latitude})",
            "city": location.city,
            "location_updated_at": datetime.now().isoformat()
        }
        
        result = supabase_admin.table("users").update(location_data).eq("id", current_user_id).execute()
        
        return {"success": True, "message": "Location updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/users/preferences")
async def update_preferences(
    preferences: UserPreferences,
    current_user_id: str = Depends(get_current_user)
):
    """Update user preferences"""
    try:
        prefs_data = preferences.dict()
        result = supabase_admin.table("users").update(prefs_data).eq("id", current_user_id).execute()
        
        return {"success": True, "preferences": result.data[0] if result.data else {}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/users/{user_id}")
async def get_user_profile(
    user_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Get another user's profile"""
    try:
        result = supabase_admin.table("users").select("*").eq("id", user_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = result.data[0]
        
        # Increment profile views
        supabase_admin.table("users").update({
            "profile_views": user.get("profile_views", 0) + 1
        }).eq("id", user_id).execute()
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# DISCOVERY & SWIPING ENDPOINTS
# ============================================

@app.get("/api/discovery")
async def get_discovery_cards(
    limit: int = Query(10, ge=1, le=50),
    current_user_id: str = Depends(get_current_user)
):
    """Get discovery cards for swiping"""
    try:
        # Get current user data
        user_result = supabase_admin.table("users").select("*").eq("id", current_user_id).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        current_user = user_result.data[0]
        
        # Get users already swiped
        swiped_result = supabase_admin.table("swipe_history").select("swiped_user_id").eq("user_id", current_user_id).execute()
        swiped_ids = [s["swiped_user_id"] for s in swiped_result.data] if swiped_result.data else []
        
        # Build query for potential matches
        query = supabase_admin.table("users").select("*")
        query = query.eq("is_approved", True)
        query = query.eq("is_banned", False)
        query = query.neq("id", current_user_id)
        
        # Apply age filter
        min_age = current_user.get("min_age", 18)
        max_age = current_user.get("max_age", 100)
        query = query.gte("age", min_age).lte("age", max_age)
        
        # Apply gender filter
        if current_user.get("show_gender"):
            query = query.eq("gender", current_user["show_gender"])
        
        # Exclude already swiped
        if swiped_ids:
            query = query.not_.in_("id", swiped_ids)
        
        result = query.limit(limit).execute()
        
        # Calculate compatibility and distance for each card
        cards = []
        for user in result.data if result.data else []:
            # Calculate compatibility
            compatibility = await ai_service.calculate_compatibility(
                current_user.get("interests", []),
                user.get("interests", []),
                current_user.get("bio", ""),
                user.get("bio", "")
            )
            
            # TODO: Calculate distance using PostGIS
            distance = None
            
            cards.append({
                **user,
                "compatibility_score": compatibility,
                "distance": distance
            })
        
        # Sort by compatibility and premium status
        cards.sort(key=lambda x: (x.get("is_premium", False), x.get("compatibility_score", 0)), reverse=True)
        
        return cards
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Discovery error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/swipe")
async def swipe_action(
    swipe: SwipeAction,
    current_user_id: str = Depends(get_current_user)
):
    """Perform a swipe action (like, pass, super_like)"""
    try:
        # Check daily limits for free users
        user_result = supabase_admin.table("users").select("is_premium, total_super_likes_given").eq("id", current_user_id).execute()
        user = user_result.data[0] if user_result.data else {}
        
        if swipe.action == "super_like" and not user.get("is_premium"):
            # Check daily super like limit
            today = datetime.now().date()
            super_likes_today = supabase_admin.table("likes").select("id").eq("liker_id", current_user_id).eq("is_super", True).gte("created_at", today.isoformat()).execute()
            
            if super_likes_today.data and len(super_likes_today.data) >= 1:
                raise HTTPException(status_code=429, detail="Daily super like limit reached")
        
        # Record swipe in history
        history_data = {
            "user_id": current_user_id,
            "swiped_user_id": swipe.swiped_user_id,
            "action": swipe.action
        }
        supabase_admin.table("swipe_history").insert(history_data).execute()
        
        # If like or super_like, create like record
        if swipe.action in ["like", "super_like"]:
            like_data = {
                "liker_id": current_user_id,
                "liked_id": swipe.swiped_user_id,
                "is_super": swipe.action == "super_like"
            }
            
            like_result = supabase_admin.table("likes").insert(like_data).execute()
            
            # Update stats
            supabase_admin.table("users").update({
                "total_likes_given": user.get("total_likes_given", 0) + 1
            }).eq("id", current_user_id).execute()
            
            if swipe.action == "super_like":
                supabase_admin.table("users").update({
                    "total_super_likes_given": user.get("total_super_likes_given", 0) + 1
                }).eq("id", current_user_id).execute()
            
            # Check for mutual match (trigger will create match automatically)
            mutual_like = supabase_admin.table("likes").select("id").eq("liker_id", swipe.swiped_user_id).eq("liked_id", current_user_id).execute()
            
            if mutual_like.data:
                return {
                    "action": swipe.action,
                    "match": True,
                    "message": "It's a match! 🎉"
                }
        
        return {
            "action": swipe.action,
            "match": False
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Swipe error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/swipe/undo")
async def undo_last_swipe(current_user_id: str = Depends(get_current_user)):
    """Undo last swipe (Premium feature)"""
    try:
        # Check if user is premium
        user_result = supabase_admin.table("users").select("is_premium, coins").eq("id", current_user_id).execute()
        user = user_result.data[0] if user_result.data else {}
        
        if not user.get("is_premium"):
            # Charge coins
            if user.get("coins", 0) < 50:
                raise HTTPException(status_code=402, detail="Insufficient coins")
            
            supabase_admin.table("users").update({"coins": user["coins"] - 50}).eq("id", current_user_id).execute()
        
        # Get last swipe
        last_swipe = supabase_admin.table("swipe_history").select("*").eq("user_id", current_user_id).order("created_at", desc=True).limit(1).execute()
        
        if not last_swipe.data:
            raise HTTPException(status_code=404, detail="No recent swipe to undo")
        
        swipe = last_swipe.data[0]
        
        # Delete swipe from history
        supabase_admin.table("swipe_history").delete().eq("id", swipe["id"]).execute()
        
        # If it was a like, delete the like
        if swipe["action"] in ["like", "super_like"]:
            supabase_admin.table("likes").delete().eq("liker_id", current_user_id).eq("liked_id", swipe["swiped_user_id"]).execute()
        
        return {"success": True, "message": "Swipe undone"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# MATCHES ENDPOINTS
# ============================================

@app.get("/api/matches")
async def get_matches(current_user_id: str = Depends(get_current_user)):
    """Get all matches for current user"""
    try:
        # Get matches where user is either user_id_1 or user_id_2
        matches_result = supabase_admin.table("matches").select("*").or_(
            f"user_id_1.eq.{current_user_id},user_id_2.eq.{current_user_id}"
        ).eq("is_blocked", False).execute()
        
        matches = []
        for match in matches_result.data if matches_result.data else []:
            # Get the other user's ID
            other_user_id = match["user_id_2"] if match["user_id_1"] == current_user_id else match["user_id_1"]
            
            # Get other user's profile
            user_result = supabase_admin.table("users").select("*").eq("id", other_user_id).execute()
            if not user_result.data:
                continue
            
            other_user = user_result.data[0]
            
            # Get last message
            last_msg = supabase_admin.table("messages").select("*").eq("match_id", match["id"]).order("sent_at", desc=True).limit(1).execute()
            
            # Get unread count
            unread_count = supabase_admin.table("messages").select("id").eq("match_id", match["id"]).eq("is_read", False).neq("sender_id", current_user_id).execute()
            
            matches.append({
                "match_id": match["id"],
                "matched_user": other_user,
                "created_at": match["created_at"],
                "last_message": last_msg.data[0] if last_msg.data else None,
                "unread_count": len(unread_count.data) if unread_count.data else 0
            })
        
        # Sort by last message time
        matches.sort(key=lambda x: x.get("last_message", {}).get("sent_at", x["created_at"]), reverse=True)
        
        return matches
    
    except Exception as e:
        print(f"Get matches error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/likes/received")
async def get_received_likes(current_user_id: str = Depends(get_current_user)):
    """Get list of users who liked you (Premium feature)"""
    try:
        # Check if user is premium
        user_result = supabase_admin.table("users").select("is_premium").eq("id", current_user_id).execute()
        user = user_result.data[0] if user_result.data else {}
        
        if not user.get("is_premium"):
            # Return blurred count only
            likes = supabase_admin.table("likes").select("id").eq("liked_id", current_user_id).execute()
            return {
                "count": len(likes.data) if likes.data else 0,
                "premium_required": True,
                "users": []
            }
        
        # Get all likes
        likes_result = supabase_admin.table("likes").select("*").eq("liked_id", current_user_id).execute()
        
        users = []
        for like in likes_result.data if likes_result.data else []:
            user_result = supabase_admin.table("users").select("*").eq("id", like["liker_id"]).execute()
            if user_result.data:
                users.append({
                    **user_result.data[0],
                    "is_super_like": like.get("is_super", False),
                    "liked_at": like["created_at"]
                })
        
        return {
            "count": len(users),
            "premium_required": False,
            "users": users
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# MESSAGING ENDPOINTS
# ============================================

@app.get("/api/messages/{match_id}")
async def get_messages(
    match_id: str,
    limit: int = Query(50, ge=1, le=100),
    current_user_id: str = Depends(get_current_user)
):
    """Get messages for a match"""
    try:
        # Verify user is part of this match
        match_result = supabase_admin.table("matches").select("*").eq("id", match_id).execute()
        if not match_result.data:
            raise HTTPException(status_code=404, detail="Match not found")
        
        match = match_result.data[0]
        if current_user_id not in [match["user_id_1"], match["user_id_2"]]:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        # Get messages
        messages_result = supabase_admin.table("messages").select("*").eq("match_id", match_id).order("sent_at", desc=False).limit(limit).execute()
        
        # Mark messages as read
        supabase_admin.table("messages").update({
            "is_read": True,
            "read_at": datetime.now().isoformat()
        }).eq("match_id", match_id).eq("is_read", False).neq("sender_id", current_user_id).execute()
        
        return messages_result.data if messages_result.data else []
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/messages")
async def send_message(
    message: MessageCreate,
    current_user_id: str = Depends(get_current_user)
):
    """Send a message"""
    try:
        # Verify match
        match_result = supabase_admin.table("matches").select("*").eq("id", message.match_id).execute()
        if not match_result.data:
            raise HTTPException(status_code=404, detail="Match not found")
        
        match = match_result.data[0]
        if current_user_id not in [match["user_id_1"], match["user_id_2"]]:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        # If sending a gift, deduct coins
        if message.message_type == "gift" and message.gift_cost:
            user_result = supabase_admin.table("users").select("coins").eq("id", current_user_id).execute()
            user = user_result.data[0] if user_result.data else {}
            
            if user.get("coins", 0) < message.gift_cost:
                raise HTTPException(status_code=402, detail="Insufficient coins")
            
            # Deduct coins
            supabase_admin.table("users").update({"coins": user["coins"] - message.gift_cost}).eq("id", current_user_id).execute()
            
            # Record transaction
            supabase_admin.table("coin_transactions").insert({
                "user_id": current_user_id,
                "amount": -message.gift_cost,
                "transaction_type": "gift_sent",
                "description": f"Sent gift: {message.gift_id}"
            }).execute()
        
        # Create message
        msg_data = {
            "match_id": message.match_id,
            "sender_id": current_user_id,
            "content": message.content,
            "message_type": message.message_type,
            "media_url": message.media_url,
            "gift_id": message.gift_id,
            "gift_cost": message.gift_cost
        }
        
        if message.message_type in ["image", "voice", "video"]:
            # Set expiration for media (7 days)
            msg_data["expires_at"] = (datetime.now() + timedelta(days=7)).isoformat()
        
        result = supabase_admin.table("messages").insert(msg_data).execute()
        
        # Create notification for recipient
        recipient_id = match["user_id_2"] if match["user_id_1"] == current_user_id else match["user_id_1"]
        supabase_admin.table("notifications").insert({
            "user_id": recipient_id,
            "notification_type": "message",
            "title": "New Message",
            "body": message.content[:50] if message.content else "You received a message",
            "data": {"match_id": message.match_id}
        }).execute()
        
        return result.data[0] if result.data else {}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Send message error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/messages/icebreaker/{match_id}")
async def get_icebreaker(
    match_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Get AI-generated icebreaker suggestion"""
    try:
        # Get match
        match_result = supabase_admin.table("matches").select("*").eq("id", match_id).execute()
        if not match_result.data:
            raise HTTPException(status_code=404, detail="Match not found")
        
        match = match_result.data[0]
        other_user_id = match["user_id_2"] if match["user_id_1"] == current_user_id else match["user_id_1"]
        
        # Get other user's profile
        user_result = supabase_admin.table("users").select("*").eq("id", other_user_id).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        other_user = user_result.data[0]
        
        # Generate icebreaker
        icebreaker = await ai_service.generate_icebreaker(other_user)
        
        return {"icebreaker": icebreaker}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# PREMIUM & COINS ENDPOINTS
# ============================================

@app.post("/api/premium/subscribe")
async def subscribe_premium(
    plan_type: str,
    payment_method: str,
    current_user_id: str = Depends(get_current_user)
):
    """Subscribe to premium"""
    try:
        # Create payment
        payment = await payment_service.create_subscription_payment(
            current_user_id, plan_type, payment_method
        )
        
        if not payment.get("success"):
            raise HTTPException(status_code=400, detail=payment.get("error", "Payment failed"))
        
        return payment
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/coins/purchase")
async def purchase_coins(
    package: str,
    payment_method: str,
    current_user_id: str = Depends(get_current_user)
):
    """Purchase coins"""
    try:
        payment = await payment_service.create_coin_purchase(
            current_user_id, package, payment_method
        )
        
        if not payment.get("success"):
            raise HTTPException(status_code=400, detail=payment.get("error", "Payment failed"))
        
        return payment
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/coins/balance")
async def get_coin_balance(current_user_id: str = Depends(get_current_user)):
    """Get user's coin balance"""
    try:
        result = supabase_admin.table("users").select("coins").eq("id", current_user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"coins": result.data[0].get("coins", 0)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# ADMIN ENDPOINTS
# ============================================

@app.get("/api/admin/stats")
async def get_admin_stats(current_user_id: str = Depends(get_current_user)):
    """Get admin dashboard statistics"""
    try:
        # TODO: Add admin role check
        
        # Total users
        total_users = supabase_admin.table("users").select("id", count="exact").execute()
        
        # Active users (last 7 days)
        seven_days_ago = (datetime.now() - timedelta(days=7)).isoformat()
        active_users = supabase_admin.table("users").select("id", count="exact").gte("last_active", seven_days_ago).execute()
        
        # Total matches
        total_matches = supabase_admin.table("matches").select("id", count="exact").execute()
        
        # Premium users
        premium_users = supabase_admin.table("users").select("id", count="exact").eq("is_premium", True).execute()
        
        # Pending approvals
        pending_approvals = supabase_admin.table("users").select("id", count="exact").eq("is_approved", False).execute()
        
        return {
            "total_users": total_users.count if hasattr(total_users, 'count') else 0,
            "active_users": active_users.count if hasattr(active_users, 'count') else 0,
            "total_matches": total_matches.count if hasattr(total_matches, 'count') else 0,
            "premium_users": premium_users.count if hasattr(premium_users, 'count') else 0,
            "pending_approvals": pending_approvals.count if hasattr(pending_approvals, 'count') else 0
        }
    except Exception as e:
        print(f"Admin stats error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/users/pending")
async def get_pending_users(current_user_id: str = Depends(get_current_user)):
    """Get users pending approval"""
    try:
        result = supabase_admin.table("users").select("*").eq("is_approved", False).execute()
        return result.data if result.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/users/{user_id}/approve")
async def approve_user(user_id: str, current_user_id: str = Depends(get_current_user)):
    """Approve a user"""
    try:
        result = supabase_admin.table("users").update({"is_approved": True}).eq("id", user_id).execute()
        return {"success": True, "user": result.data[0] if result.data else {}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/users/{user_id}/reject")
async def reject_user(user_id: str, reason: str, current_user_id: str = Depends(get_current_user)):
    """Reject a user"""
    try:
        result = supabase_admin.table("users").update({
            "is_banned": True,
            "ban_reason": reason
        }).eq("id", user_id).execute()
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/settings")
async def update_admin_settings(
    setting_key: str,
    setting_value: str,
    current_user_id: str = Depends(get_current_user)
):
    """Update admin settings (OAuth keys, etc.)"""
    try:
        # Upsert setting
        result = supabase_admin.table("admin_settings").upsert({
            "setting_key": setting_key,
            "setting_value": setting_value,
            "updated_at": datetime.now().isoformat()
        }).execute()
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/settings")
async def get_admin_settings(current_user_id: str = Depends(get_current_user)):
    """Get admin settings"""
    try:
        result = supabase_admin.table("admin_settings").select("*").execute()
        
        # Convert to dict
        settings = {}
        for row in result.data if result.data else []:
            settings[row["setting_key"]] = row["setting_value"]
        
        return settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# RUN SERVER
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
