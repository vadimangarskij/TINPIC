-- ConnectSphere Dating App - Supabase Database Schema
-- Complete SQL Migration for Production

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  date_of_birth DATE,
  age INTEGER CHECK (age >= 18 AND age <= 100),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  bio TEXT CHECK (length(bio) <= 500),
  
  -- Photos array with verification status
  photos JSONB DEFAULT '[]'::jsonb,
  
  -- Interests array
  interests TEXT[] DEFAULT '{}',
  
  -- Location data with PostGIS
  location GEOGRAPHY(POINT, 4326),
  city TEXT,
  location_updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Social links
  instagram TEXT,
  spotify TEXT,
  facebook TEXT,
  
  -- Profile details
  job_title TEXT,
  company TEXT,
  education TEXT,
  height INTEGER, -- in cm
  
  -- Lifestyle preferences
  smoking TEXT CHECK (smoking IN ('never', 'socially', 'regularly', 'prefer_not_say')),
  drinking TEXT CHECK (drinking IN ('never', 'socially', 'regularly', 'prefer_not_say')),
  pets TEXT CHECK (pets IN ('none', 'dog', 'cat', 'other', 'love_pets')),
  exercise TEXT CHECK (exercise IN ('never', 'sometimes', 'regularly', 'very_active')),
  
  -- Preferences
  looking_for TEXT CHECK (looking_for IN ('relationship', 'friendship', 'casual', 'not_sure')),
  show_gender TEXT, -- Preferred gender to see
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 100,
  max_distance INTEGER DEFAULT 100, -- in km
  
  -- Privacy settings
  hide_online_status BOOLEAN DEFAULT FALSE,
  hide_distance BOOLEAN DEFAULT FALSE,
  hide_age BOOLEAN DEFAULT FALSE,
  invisible_mode BOOLEAN DEFAULT FALSE, -- Premium feature
  
  -- Premium and coins
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP,
  coins INTEGER DEFAULT 0,
  
  -- Verification and moderation
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  
  -- Customization (Premium)
  profile_theme TEXT DEFAULT 'default',
  profile_badge TEXT,
  profile_frame TEXT,
  animated_avatar TEXT, -- URL to GIF
  
  -- Stats
  total_likes_given INTEGER DEFAULT 0,
  total_likes_received INTEGER DEFAULT 0,
  total_super_likes_given INTEGER DEFAULT 0,
  total_matches INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  
  -- Compatibility score (calculated by AI)
  compatibility_data JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  
  -- OAuth integration
  google_id TEXT UNIQUE,
  facebook_id TEXT UNIQUE
);

-- ============================================
-- LIKES TABLE (Swipes)
-- ============================================
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  liker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  liked_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_super BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(liker_id, liked_id)
);

-- ============================================
-- MATCHES TABLE
-- ============================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id_1 UUID REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  is_blocked BOOLEAN DEFAULT FALSE,
  blocked_by UUID REFERENCES users(id),
  UNIQUE(user_id_1, user_id_2),
  CHECK (user_id_1 < user_id_2) -- Ensure consistent ordering
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'voice', 'video', 'gift')),
  media_url TEXT,
  
  -- Gift data
  gift_id TEXT,
  gift_cost INTEGER,
  
  -- Read status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Expiration for media (7 days)
  expires_at TIMESTAMP,
  
  sent_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SWIPE HISTORY (for undo feature)
-- ============================================
CREATE TABLE swipe_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  swiped_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT CHECK (action IN ('like', 'pass', 'super_like')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Payment provider data
  payment_provider TEXT CHECK (payment_provider IN ('yoomoney', 'qiwi', 'telegram', 'stripe')),
  external_subscription_id TEXT,
  
  -- Subscription details
  plan_type TEXT DEFAULT 'premium' CHECK (plan_type IN ('premium', 'vip')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  
  -- Pricing
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'RUB',
  
  -- Dates
  starts_at TIMESTAMP DEFAULT NOW(),
  ends_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- COIN TRANSACTIONS TABLE
-- ============================================
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positive for credit, negative for debit
  transaction_type TEXT CHECK (transaction_type IN ('purchase', 'gift_received', 'gift_sent', 'boost', 'super_like', 'rewind', 'admin_grant', 'achievement')),
  description TEXT,
  reference_id UUID, -- Link to related entity (gift, boost, etc.)
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- BOOSTS TABLE
-- ============================================
CREATE TABLE boosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  boost_type TEXT CHECK (boost_type IN ('profile_boost', 'super_boost')),
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- REPORTS TABLE
-- ============================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT CHECK (reason IN ('inappropriate_content', 'fake_profile', 'harassment', 'spam', 'underage', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'action_taken', 'dismissed')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  action_taken TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- QUIZ RESPONSES (for compatibility)
-- ============================================
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location GEOGRAPHY(POINT, 4326),
  location_name TEXT,
  event_date TIMESTAMP NOT NULL,
  max_participants INTEGER,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- EVENT PARTICIPANTS TABLE
-- ============================================
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================
-- INTEREST GROUPS TABLE
-- ============================================
CREATE TABLE interest_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- GROUP MEMBERS TABLE
-- ============================================
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES interest_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  coin_reward INTEGER DEFAULT 0,
  criteria JSONB -- Conditions to unlock
);

-- ============================================
-- USER ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- REFERRALS TABLE
-- ============================================
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reward_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(referred_user_id)
);

-- ============================================
-- ADMIN SETTINGS TABLE (for OAuth keys)
-- ============================================
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  is_encrypted BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  notification_type TEXT CHECK (notification_type IN ('match', 'message', 'like', 'super_like', 'gift', 'event', 'achievement')),
  title TEXT,
  body TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- Users
CREATE INDEX idx_users_location ON users USING GIST (location);
CREATE INDEX idx_users_is_premium ON users (is_premium);
CREATE INDEX idx_users_is_approved ON users (is_approved);
CREATE INDEX idx_users_is_banned ON users (is_banned);
CREATE INDEX idx_users_last_active ON users (last_active DESC);
CREATE INDEX idx_users_age ON users (age);
CREATE INDEX idx_users_gender ON users (gender);

-- Likes
CREATE INDEX idx_likes_liker ON likes (liker_id);
CREATE INDEX idx_likes_liked ON likes (liked_id);
CREATE INDEX idx_likes_created ON likes (created_at DESC);

-- Matches
CREATE INDEX idx_matches_user1 ON matches (user_id_1);
CREATE INDEX idx_matches_user2 ON matches (user_id_2);
CREATE INDEX idx_matches_created ON matches (created_at DESC);

-- Messages
CREATE INDEX idx_messages_match ON messages (match_id);
CREATE INDEX idx_messages_sender ON messages (sender_id);
CREATE INDEX idx_messages_sent ON messages (sent_at DESC);
CREATE INDEX idx_messages_read ON messages (is_read);

-- Swipe History
CREATE INDEX idx_swipe_history_user ON swipe_history (user_id);
CREATE INDEX idx_swipe_history_created ON swipe_history (created_at DESC);

-- Subscriptions
CREATE INDEX idx_subscriptions_user ON subscriptions (user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions (status);

-- Coin Transactions
CREATE INDEX idx_coin_transactions_user ON coin_transactions (user_id);
CREATE INDEX idx_coin_transactions_created ON coin_transactions (created_at DESC);

-- Boosts
CREATE INDEX idx_boosts_user ON boosts (user_id);
CREATE INDEX idx_boosts_active ON boosts (is_active, expires_at);

-- Reports
CREATE INDEX idx_reports_reporter ON reports (reporter_id);
CREATE INDEX idx_reports_reported ON reports (reported_user_id);
CREATE INDEX idx_reports_status ON reports (status);

-- Events
CREATE INDEX idx_events_location ON events USING GIST (location);
CREATE INDEX idx_events_date ON events (event_date);
CREATE INDEX idx_events_active ON events (is_active);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications (user_id);
CREATE INDEX idx_notifications_read ON notifications (is_read);
CREATE INDEX idx_notifications_created ON notifications (created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view approved profiles" ON users FOR SELECT USING (is_approved = TRUE AND is_banned = FALSE);

-- Likes policies
CREATE POLICY "Users can view own likes" ON likes FOR SELECT USING (auth.uid() = liker_id OR auth.uid() = liked_id);
CREATE POLICY "Users can create likes" ON likes FOR INSERT WITH CHECK (auth.uid() = liker_id);

-- Matches policies
CREATE POLICY "Users can view own matches" ON matches FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Messages policies
CREATE POLICY "Users can view match messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM matches 
    WHERE matches.id = messages.match_id 
    AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
  )
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Swipe history policies
CREATE POLICY "Users can view own swipes" ON swipe_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create swipes" ON swipe_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Coin transactions policies
CREATE POLICY "Users can view own transactions" ON coin_transactions FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate distance between two points (in km)
CREATE OR REPLACE FUNCTION calculate_distance(lat1 FLOAT, lon1 FLOAT, lat2 FLOAT, lon2 FLOAT)
RETURNS FLOAT AS $$
BEGIN
  RETURN ST_Distance(
    ST_MakePoint(lon1, lat1)::geography,
    ST_MakePoint(lon2, lat2)::geography
  ) / 1000;
END;
$$ LANGUAGE plpgsql;

-- Function to create a match when mutual like occurs
CREATE OR REPLACE FUNCTION check_and_create_match()
RETURNS TRIGGER AS $$
DECLARE
  mutual_like_exists BOOLEAN;
  new_match_id UUID;
BEGIN
  -- Check if the liked user has also liked the liker
  SELECT EXISTS(
    SELECT 1 FROM likes 
    WHERE liker_id = NEW.liked_id AND liked_id = NEW.liker_id
  ) INTO mutual_like_exists;
  
  -- If mutual like exists, create a match
  IF mutual_like_exists THEN
    -- Ensure user_id_1 < user_id_2 for consistency
    IF NEW.liker_id < NEW.liked_id THEN
      INSERT INTO matches (user_id_1, user_id_2)
      VALUES (NEW.liker_id, NEW.liked_id)
      ON CONFLICT (user_id_1, user_id_2) DO NOTHING
      RETURNING id INTO new_match_id;
    ELSE
      INSERT INTO matches (user_id_1, user_id_2)
      VALUES (NEW.liked_id, NEW.liker_id)
      ON CONFLICT (user_id_1, user_id_2) DO NOTHING
      RETURNING id INTO new_match_id;
    END IF;
    
    -- Create notifications for both users
    IF new_match_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, notification_type, title, body)
      VALUES 
        (NEW.liker_id, 'match', 'New Match!', 'You have a new match!'),
        (NEW.liked_id, 'match', 'New Match!', 'You have a new match!');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic match creation
CREATE TRIGGER create_match_on_mutual_like
AFTER INSERT ON likes
FOR EACH ROW EXECUTE FUNCTION check_and_create_match();

-- ============================================
-- SEED DATA - Default Achievements
-- ============================================

INSERT INTO achievements (name, description, icon, coin_reward, criteria) VALUES
('First Match', 'Get your first match', '🎉', 50, '{"matches": 1}'::jsonb),
('Popular', 'Get 10 matches', '⭐', 100, '{"matches": 10}'::jsonb),
('Social Butterfly', 'Get 50 matches', '🦋', 500, '{"matches": 50}'::jsonb),
('Conversation Starter', 'Send 100 messages', '💬', 100, '{"messages_sent": 100}'::jsonb),
('Photo Verified', 'Verify your profile photo', '✓', 100, '{"photo_verified": true}'::jsonb),
('Complete Profile', 'Fill out all profile fields', '📝', 50, '{"profile_complete": true}'::jsonb),
('Early Bird', 'Be online before 8 AM', '🌅', 25, '{"early_bird": true}'::jsonb),
('Night Owl', 'Be online after 11 PM', '🦉', 25, '{"night_owl": true}'::jsonb),
('Super Liker', 'Use 10 super likes', '💖', 100, '{"super_likes": 10}'::jsonb),
('Generous', 'Send 5 virtual gifts', '🎁', 150, '{"gifts_sent": 5}'::jsonb),
('Explorer', 'Join 3 different events', '🗺️', 75, '{"events_joined": 3}'::jsonb),
('Community Leader', 'Create an event', '👑', 200, '{"events_created": 1}'::jsonb),
('Group Member', 'Join 5 interest groups', '👥', 100, '{"groups_joined": 5}'::jsonb),
('Referral Master', 'Refer 3 friends', '🤝', 300, '{"referrals": 3}'::jsonb),
('Week Streak', 'Login for 7 days in a row', '🔥', 100, '{"login_streak": 7}'::jsonb),
('Month Streak', 'Login for 30 days in a row', '⚡', 500, '{"login_streak": 30}'::jsonb),
('Active Chatter', 'Chat with 10 different matches', '💭', 150, '{"unique_chats": 10}'::jsonb),
('Profile Visitor', 'View 100 profiles', '👀', 50, '{"profiles_viewed": 100}'::jsonb),
('Liked', 'Receive 50 likes', '❤️', 200, '{"likes_received": 50}'::jsonb),
('Super Liked', 'Receive 5 super likes', '💝', 150, '{"super_likes_received": 5}'::jsonb),
('Premium Member', 'Become a premium member', '💎', 0, '{"is_premium": true}'::jsonb),
('Fast Responder', 'Reply within 1 minute 10 times', '⚡', 100, '{"fast_responses": 10}'::jsonb),
('Ice Breaker', 'Start a conversation first 20 times', '🧊', 100, '{"first_messages": 20}'::jsonb),
('Weekend Warrior', 'Be active all weekend', '🎮', 75, '{"weekend_active": true}'::jsonb),
('Distance Traveler', 'Match with someone 100km+ away', '✈️', 100, '{"long_distance_match": true}'::jsonb);

-- ============================================
-- DEFAULT ADMIN SETTINGS
-- ============================================

INSERT INTO admin_settings (setting_key, setting_value) VALUES
('google_oauth_client_id', NULL),
('google_oauth_client_secret', NULL),
('facebook_oauth_client_id', NULL),
('facebook_oauth_client_secret', NULL),
('openai_api_key', NULL),
('yoomoney_api_key', NULL),
('qiwi_api_key', NULL),
('telegram_bot_token', NULL),
('app_name', 'ConnectSphere'),
('app_version', '1.0.0'),
('maintenance_mode', 'false'),
('registration_enabled', 'true');

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- Daily active users
CREATE OR REPLACE VIEW daily_active_users AS
SELECT 
  DATE(last_active) as date,
  COUNT(DISTINCT id) as active_users
FROM users
WHERE last_active >= NOW() - INTERVAL '30 days'
GROUP BY DATE(last_active)
ORDER BY date DESC;

-- Match rate by day
CREATE OR REPLACE VIEW daily_match_rate AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_matches
FROM matches
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Revenue by day (subscriptions)
CREATE OR REPLACE VIEW daily_revenue AS
SELECT 
  DATE(created_at) as date,
  SUM(amount) as revenue,
  COUNT(*) as subscription_count
FROM subscriptions
WHERE created_at >= NOW() - INTERVAL '30 days'
AND status = 'active'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'Main users table with profile information';
COMMENT ON TABLE likes IS 'Swipe actions (like, pass, super like)';
COMMENT ON TABLE matches IS 'Mutual matches between users';
COMMENT ON TABLE messages IS 'Chat messages between matched users';
COMMENT ON TABLE subscriptions IS 'Premium subscription records';
COMMENT ON TABLE coin_transactions IS 'In-app coin purchase and usage history';
COMMENT ON TABLE achievements IS 'Available achievements in the app';
COMMENT ON TABLE events IS 'Local events created by users';
COMMENT ON TABLE interest_groups IS 'Community groups based on interests';

-- ============================================
-- END OF MIGRATION
-- ============================================
