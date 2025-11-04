from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("⚠️ WARNING: Supabase credentials not configured")
    print("Please set SUPABASE_URL and SUPABASE_KEY in .env file")

def get_supabase_client() -> Client:
    """Get Supabase client with anon key for standard operations"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise Exception("Supabase not configured")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase_admin() -> Client:
    """Get Supabase client with service role key for admin operations"""
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        raise Exception("Supabase admin not configured")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

supabase: Client = None
supabase_admin: Client = None

try:
    if SUPABASE_URL and SUPABASE_KEY:
        supabase = get_supabase_client()
        print("✅ Supabase client initialized")
    if SUPABASE_URL and SUPABASE_SERVICE_KEY:
        supabase_admin = get_supabase_admin()
        print("✅ Supabase admin initialized")
except Exception as e:
    print(f"❌ Supabase initialization error: {e}")
