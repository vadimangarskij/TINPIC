"""
Fix column naming inconsistencies and apply missing policies
"""
import requests
import time

ACCESS_TOKEN = "sbp_ce3901655c9174557164fe06f4c493ec3097c825"
PROJECT_REF = "fhdtvadviuvxahsgrqyz"

def execute_sql(sql):
    """Execute SQL via Management API"""
    url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {"query": sql}
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        if response.status_code in [200, 201]:
            return True, "Success"
        else:
            return False, f"HTTP {response.status_code}: {response.text[:150]}"
    except Exception as e:
        return False, str(e)

print("="*70)
print("🔧 FIXING COLUMN NAMING ISSUES")
print("="*70)

fixes = [
    # Fix matches table index
    ("DROP INDEX IF EXISTS idx_matches_users", "Drop old index"),
    ("CREATE INDEX IF NOT EXISTS idx_matches_users ON public.matches(user_id_1, user_id_2)", "Create correct index"),
    
    # Fix matches RLS policies with correct column names
    ("DROP POLICY IF EXISTS \"Users can view their matches\" ON public.matches", "Drop old policy"),
    ("""CREATE POLICY "Users can view their matches"
        ON public.matches
        FOR SELECT
        USING (
          auth.uid()::text = user_id_1::text 
          OR auth.uid()::text = user_id_2::text
        )""", "Create correct matches view policy"),
    
    # Fix messages RLS policies
    ("DROP POLICY IF EXISTS \"Users can view messages in their matches\" ON public.messages", "Drop old policy"),
    ("""CREATE POLICY "Users can view messages in their matches"
        ON public.messages
        FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.matches 
            WHERE matches.id = messages.match_id 
            AND (matches.user_id_1::text = auth.uid()::text OR matches.user_id_2::text = auth.uid()::text)
          )
        )""", "Create correct messages view policy"),
    
    ("DROP POLICY IF EXISTS \"Users can send messages in their matches\" ON public.messages", "Drop old policy"),
    ("""CREATE POLICY "Users can send messages in their matches"
        ON public.messages
        FOR INSERT
        TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.matches 
            WHERE matches.id = match_id 
            AND (matches.user_id_1::text = auth.uid()::text OR matches.user_id_2::text = auth.uid()::text)
          )
          AND auth.uid()::text = sender_id::text
        )""", "Create correct messages insert policy"),
    
    # Create missing functions with proper delimiters
    ("""CREATE OR REPLACE FUNCTION public.update_updated_at_column()
        RETURNS TRIGGER
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public
        AS $function$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $function$""", "Create update_updated_at function"),
    
    ("""CREATE OR REPLACE FUNCTION public.calculate_distance(
            lat1 double precision,
            lon1 double precision,
            lat2 double precision,
            lon2 double precision
        )
        RETURNS double precision
        LANGUAGE plpgsql
        IMMUTABLE
        SET search_path = public
        AS $function$
        BEGIN
            RETURN (
                6371 * acos(
                    cos(radians(lat1)) * cos(radians(lat2)) * 
                    cos(radians(lon2) - radians(lon1)) + 
                    sin(radians(lat1)) * sin(radians(lat2))
                )
            );
        END;
        $function$""", "Create calculate_distance function"),
    
    ("""CREATE OR REPLACE FUNCTION public.check_and_create_match()
        RETURNS TRIGGER
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public
        AS $function$
        BEGIN
            IF NEW.action = 'like' THEN
                IF EXISTS (
                    SELECT 1 FROM public.swipes
                    WHERE user_id = NEW.swiped_user_id
                    AND swiped_user_id = NEW.user_id
                    AND action = 'like'
                ) THEN
                    INSERT INTO public.matches (user_id_1, user_id_2)
                    VALUES (
                        LEAST(NEW.user_id, NEW.swiped_user_id),
                        GREATEST(NEW.user_id, NEW.swiped_user_id)
                    )
                    ON CONFLICT DO NOTHING;
                END IF;
            END IF;
            RETURN NEW;
        END;
        $function$""", "Create check_and_create_match function"),
    
    # Create trigger
    ("DROP TRIGGER IF EXISTS trigger_check_and_create_match ON public.swipes", "Drop old trigger"),
    ("""CREATE TRIGGER trigger_check_and_create_match
        AFTER INSERT ON public.swipes
        FOR EACH ROW
        EXECUTE FUNCTION public.check_and_create_match()""", "Create auto-match trigger"),
]

success = 0
errors = 0

for sql, description in fixes:
    print(f"\n⏳ {description}...")
    result, message = execute_sql(sql)
    
    if result:
        print(f"   ✅ Success")
        success += 1
    else:
        print(f"   ❌ Failed: {message}")
        errors += 1
    
    time.sleep(0.5)

print("\n" + "="*70)
print(f"📊 RESULTS: ✅ {success} successful | ❌ {errors} errors")
print("="*70)
print("\n🎉 Database fixes applied!")
print("\nVerify in Supabase Dashboard:")
print("  1. Table Editor → Check all tables exist")
print("  2. Database → Advisors → Should show minimal errors")
print("  3. Test registration in the app")
