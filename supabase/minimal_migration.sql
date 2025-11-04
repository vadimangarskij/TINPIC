-- ConnectSphere - Minimal Migration for Quick Start
-- Apply this FIRST, then apply fix_rls_and_policies.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  date_of_birth DATE,
  age INTEGER CHECK (age >= 18 AND age <= 100),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  bio TEXT CHECK (length(bio) <= 500),
  
  photos JSONB DEFAULT '[]'::jsonb,
  interests TEXT[] DEFAULT '{}',
  
  location GEOGRAPHY(POINT, 4326),
  city TEXT,
  location_updated_at TIMESTAMP DEFAULT NOW(),
  
  instagram TEXT,
  spotify TEXT,
  facebook TEXT,
  
  job_title TEXT,
  company TEXT,
  education TEXT,
  height INTEGER,
  
  smoking TEXT CHECK (smoking IN ('never', 'socially', 'regularly', 'prefer_not_say')),
  drinking TEXT CHECK (drinking IN ('never', 'socially', 'regularly', 'prefer_not_say')),
  pets TEXT CHECK (pets IN ('none', 'dog', 'cat', 'other', 'love_pets')),
  exercise TEXT CHECK (exercise IN ('never', 'sometimes', 'regularly', 'very_active')),
  
  looking_for TEXT CHECK (looking_for IN ('relationship', 'friendship', 'casual', 'not_sure')),
  show_gender TEXT,
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 100,
  max_distance INTEGER DEFAULT 100,
  
  hide_online_status BOOLEAN DEFAULT FALSE,
  hide_distance BOOLEAN DEFAULT FALSE,
  hide_age BOOLEAN DEFAULT FALSE,
  invisible_mode BOOLEAN DEFAULT FALSE,
  
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP,
  coins INTEGER DEFAULT 0,
  
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  
  profile_theme TEXT DEFAULT 'default',
  profile_badge TEXT,
  profile_frame TEXT,
  animated_avatar TEXT,
  
  total_likes_given INTEGER DEFAULT 0,
  total_likes_received INTEGER DEFAULT 0,
  total_super_likes_given INTEGER DEFAULT 0,
  total_super_likes_received INTEGER DEFAULT 0,
  total_matches INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  
  compatibility_data JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW(),
  
  google_id TEXT UNIQUE,
  facebook_id TEXT UNIQUE
);

-- ============================================
-- SWIPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.swipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  swiped_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT CHECK (action IN ('like', 'pass', 'super_like')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, swiped_user_id)
);

-- ============================================
-- MATCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  is_unmatched BOOLEAN DEFAULT FALSE,
  unmatched_by UUID REFERENCES public.users(id),
  unmatched_at TIMESTAMP,
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id)
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'voice', 'video', 'gift')),
  media_url TEXT,
  gift_id TEXT,
  gift_cost INTEGER,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  expires_at TIMESTAMP,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reported_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT CHECK (reason IN ('spam', 'harassment', 'fake_profile', 'inappropriate_content', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'action_taken', 'dismissed')),
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES public.users(id)
);

-- ============================================
-- BLOCKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  payment_provider TEXT CHECK (payment_provider IN ('yoomoney', 'qiwi', 'telegram', 'stripe')),
  external_subscription_id TEXT,
  plan_type TEXT DEFAULT 'premium' CHECK (plan_type IN ('premium', 'vip')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'RUB',
  starts_at TIMESTAMP DEFAULT NOW(),
  ends_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- COIN TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.coin_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('purchase', 'gift_received', 'gift_sent', 'boost', 'super_like', 'rewind', 'admin_grant', 'achievement')),
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- GIFTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  gift_type TEXT,
  cost INTEGER,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- BOOSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.boosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  boost_type TEXT CHECK (boost_type IN ('profile', 'super_like', 'priority')),
  duration_minutes INTEGER DEFAULT 30,
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- QUIZ RESPONSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  quiz_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT,
  location GEOGRAPHY(POINT, 4326),
  city TEXT,
  venue TEXT,
  starts_at TIMESTAMP,
  ends_at TIMESTAMP,
  max_participants INTEGER,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- EVENT PARTICIPANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'declined')),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================
-- INTEREST GROUPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.interest_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- GROUP MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.interest_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  requirement_type TEXT,
  requirement_value INTEGER,
  reward_coins INTEGER DEFAULT 0
);

-- ============================================
-- USER ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- REFERRALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  referral_code TEXT,
  reward_coins INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- ============================================
-- ADMIN SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_location ON public.users USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_swipes_user_id ON public.swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped_user_id ON public.swipes(swiped_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_users ON public.matches(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON public.messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Calculate distance function
CREATE OR REPLACE FUNCTION public.calculate_distance(
    lat1 double precision,
    lon1 double precision,
    lat2 double precision,
    lon2 double precision
)
RETURNS double precision AS $$
BEGIN
    RETURN (
        6371 * acos(
            cos(radians(lat1)) * cos(radians(lat2)) * 
            cos(radians(lon2) - radians(lon1)) + 
            sin(radians(lat1)) * sin(radians(lat2))
        )
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Check and create match function
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.action = 'like' THEN
        IF EXISTS (
            SELECT 1 FROM public.swipes
            WHERE user_id = NEW.swiped_user_id
            AND swiped_user_id = NEW.user_id
            AND action = 'like'
        ) THEN
            INSERT INTO public.matches (user1_id, user2_id)
            VALUES (
                LEAST(NEW.user_id, NEW.swiped_user_id),
                GREATEST(NEW.user_id, NEW.swiped_user_id)
            )
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic matching
DROP TRIGGER IF EXISTS trigger_check_and_create_match ON public.swipes;
CREATE TRIGGER trigger_check_and_create_match
    AFTER INSERT ON public.swipes
    FOR EACH ROW
    EXECUTE FUNCTION public.check_and_create_match();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ All tables, indexes, and functions created successfully!';
    RAISE NOTICE '📝 Next step: Apply fix_rls_and_policies.sql for security';
END $$;
