-- Fix RLS and Security Issues for ConnectSphere Dating App

-- =====================================================
-- 1. ENABLE RLS ON ALL PUBLIC TABLES
-- =====================================================

ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.interest_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. DROP EXISTING POLICIES (if any)
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view approved profiles" ON public.users;
DROP POLICY IF EXISTS "Service role has full access to users" ON public.users;

-- =====================================================
-- 3. CREATE RLS POLICIES FOR USERS TABLE
-- =====================================================

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
USING (auth.uid()::text = id::text);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
USING (auth.uid()::text = id::text);

-- Allow users to view other approved profiles
CREATE POLICY "Users can view approved profiles"
ON public.users
FOR SELECT
USING (is_approved = true);

-- Allow service role full access
CREATE POLICY "Service role has full access to users"
ON public.users
FOR ALL
USING (auth.role() = 'service_role');

-- Allow authenticated users to insert (for registration)
CREATE POLICY "Allow authenticated users to insert"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- 4. CREATE RLS POLICIES FOR SWIPES TABLE
-- =====================================================

CREATE POLICY "Users can view their own swipes"
ON public.swipes
FOR SELECT
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create swipes"
ON public.swipes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Service role has full access to swipes"
ON public.swipes
FOR ALL
USING (auth.role() = 'service_role');

-- =====================================================
-- 5. CREATE RLS POLICIES FOR MATCHES TABLE
-- =====================================================

CREATE POLICY "Users can view their matches"
ON public.matches
FOR SELECT
USING (
  auth.uid()::text = user1_id::text 
  OR auth.uid()::text = user2_id::text
);

CREATE POLICY "Service role can create matches"
ON public.matches
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role has full access to matches"
ON public.matches
FOR ALL
USING (auth.role() = 'service_role');

-- =====================================================
-- 6. CREATE RLS POLICIES FOR MESSAGES TABLE
-- =====================================================

CREATE POLICY "Users can view messages in their matches"
ON public.messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = messages.match_id 
    AND (matches.user1_id::text = auth.uid()::text OR matches.user2_id::text = auth.uid()::text)
  )
);

CREATE POLICY "Users can send messages in their matches"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = match_id 
    AND (matches.user1_id::text = auth.uid()::text OR matches.user2_id::text = auth.uid()::text)
  )
  AND auth.uid()::text = sender_id::text
);

CREATE POLICY "Service role has full access to messages"
ON public.messages
FOR ALL
USING (auth.role() = 'service_role');

-- =====================================================
-- 7. CREATE RLS POLICIES FOR REPORTS TABLE
-- =====================================================

CREATE POLICY "Users can create reports"
ON public.reports
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = reporter_id::text);

CREATE POLICY "Users can view their own reports"
ON public.reports
FOR SELECT
USING (auth.uid()::text = reporter_id::text);

CREATE POLICY "Service role has full access to reports"
ON public.reports
FOR ALL
USING (auth.role() = 'service_role');

-- =====================================================
-- 8. CREATE RLS POLICIES FOR BLOCKS TABLE
-- =====================================================

CREATE POLICY "Users can view their blocks"
ON public.blocks
FOR SELECT
USING (auth.uid()::text = blocker_id::text);

CREATE POLICY "Users can create blocks"
ON public.blocks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = blocker_id::text);

CREATE POLICY "Users can delete their blocks"
ON public.blocks
FOR DELETE
USING (auth.uid()::text = blocker_id::text);

-- =====================================================
-- 9. CREATE RLS POLICIES FOR SUBSCRIPTIONS TABLE
-- =====================================================

CREATE POLICY "Users can view their own subscriptions"
ON public.subscriptions
FOR SELECT
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role has full access to subscriptions"
ON public.subscriptions
FOR ALL
USING (auth.role() = 'service_role');

-- =====================================================
-- 10. CREATE RLS POLICIES FOR COIN_TRANSACTIONS TABLE
-- =====================================================

CREATE POLICY "Users can view their coin transactions"
ON public.coin_transactions
FOR SELECT
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role has full access to coin_transactions"
ON public.coin_transactions
FOR ALL
USING (auth.role() = 'service_role');

-- =====================================================
-- 11. CREATE RLS POLICIES FOR REMAINING TABLES
-- =====================================================

-- Gifts
CREATE POLICY "Users can view gifts they sent or received"
ON public.gifts
FOR SELECT
USING (
  auth.uid()::text = sender_id::text 
  OR auth.uid()::text = recipient_id::text
);

CREATE POLICY "Service role has full access to gifts"
ON public.gifts
FOR ALL
USING (auth.role() = 'service_role');

-- Boosts
CREATE POLICY "Users can view their boosts"
ON public.boosts
FOR SELECT
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role has full access to boosts"
ON public.boosts
FOR ALL
USING (auth.role() = 'service_role');

-- Quiz Responses
CREATE POLICY "Users can view their quiz responses"
ON public.quiz_responses
FOR SELECT
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create quiz responses"
ON public.quiz_responses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

-- Events
CREATE POLICY "All authenticated users can view events"
ON public.events
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Service role has full access to events"
ON public.events
FOR ALL
USING (auth.role() = 'service_role');

-- Event Participants
CREATE POLICY "Users can view event participants"
ON public.event_participants
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can join events"
ON public.event_participants
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

-- Interest Groups
CREATE POLICY "All authenticated users can view groups"
ON public.interest_groups
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Service role has full access to interest_groups"
ON public.interest_groups
FOR ALL
USING (auth.role() = 'service_role');

-- Group Members
CREATE POLICY "Users can view group members"
ON public.group_members
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can join groups"
ON public.group_members
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

-- Achievements
CREATE POLICY "All users can view achievements"
ON public.achievements
FOR SELECT
TO authenticated
USING (true);

-- User Achievements
CREATE POLICY "Users can view their achievements"
ON public.user_achievements
FOR SELECT
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role has full access to user_achievements"
ON public.user_achievements
FOR ALL
USING (auth.role() = 'service_role');

-- Referrals
CREATE POLICY "Users can view their referrals"
ON public.referrals
FOR SELECT
USING (
  auth.uid()::text = referrer_id::text 
  OR auth.uid()::text = referred_id::text
);

CREATE POLICY "Service role has full access to referrals"
ON public.referrals
FOR ALL
USING (auth.role() = 'service_role');

-- Admin Settings (only service role)
CREATE POLICY "Only service role can access admin_settings"
ON public.admin_settings
FOR ALL
USING (auth.role() = 'service_role');

-- =====================================================
-- 12. FIX FUNCTION SEARCH PATHS
-- =====================================================

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix calculate_distance function
CREATE OR REPLACE FUNCTION public.calculate_distance(
    lat1 double precision,
    lon1 double precision,
    lat2 double precision,
    lon2 double precision
)
RETURNS double precision
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
    RETURN (
        6371 * acos(
            cos(radians(lat1)) * cos(radians(lat2)) * 
            cos(radians(lon2) - radians(lon1)) + 
            sin(radians(lat1)) * sin(radians(lat2))
        )
    );
END;
$$;

-- Fix check_and_create_match function
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- =====================================================
-- 13. DROP SECURITY DEFINER VIEWS
-- =====================================================

DROP VIEW IF EXISTS public.daily_active_users CASCADE;
DROP VIEW IF EXISTS public.daily_revenue CASCADE;
DROP VIEW IF EXISTS public.daily_match_rate CASCADE;

-- Recreate views without SECURITY DEFINER
CREATE VIEW public.daily_active_users AS
SELECT 
    DATE(last_active_at) as date,
    COUNT(DISTINCT id) as active_users
FROM public.users
WHERE last_active_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(last_active_at)
ORDER BY date DESC;

CREATE VIEW public.daily_revenue AS
SELECT 
    DATE(created_at) as date,
    SUM(amount) as revenue
FROM public.coin_transactions
WHERE transaction_type = 'purchase'
AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE VIEW public.daily_match_rate AS
SELECT 
    DATE(s.created_at) as date,
    COUNT(DISTINCT m.id)::float / NULLIF(COUNT(DISTINCT s.id), 0) as match_rate
FROM public.swipes s
LEFT JOIN public.matches m ON DATE(m.created_at) = DATE(s.created_at)
WHERE s.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(s.created_at)
ORDER BY date DESC;

-- Grant select on views to authenticated users
GRANT SELECT ON public.daily_active_users TO authenticated;
GRANT SELECT ON public.daily_revenue TO service_role;
GRANT SELECT ON public.daily_match_rate TO service_role;

-- =====================================================
-- COMPLETE! All RLS policies and security fixes applied
-- =====================================================
