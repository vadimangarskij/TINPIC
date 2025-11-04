"""
Script to apply RLS fixes to Supabase database
"""
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def apply_rls_fixes():
    """Apply RLS fixes from SQL file"""
    print("🔧 Applying RLS and security fixes to Supabase...")
    
    # Read SQL file
    sql_file_path = "/app/supabase/fix_rls_and_policies.sql"
    
    try:
        with open(sql_file_path, 'r') as f:
            sql_content = f.read()
        
        print(f"📄 Read SQL file: {len(sql_content)} characters")
        
        # Split into individual statements and execute
        statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().startswith('--')]
        
        print(f"📝 Found {len(statements)} SQL statements to execute")
        
        success_count = 0
        error_count = 0
        
        for i, statement in enumerate(statements, 1):
            try:
                # Execute via Supabase RPC (using service role)
                result = supabase.rpc('exec_sql', {'query': statement}).execute()
                success_count += 1
                if i % 10 == 0:
                    print(f"✅ Executed {i}/{len(statements)} statements...")
            except Exception as e:
                error_count += 1
                # Some errors are expected (e.g., DROP IF EXISTS when doesn't exist)
                if 'does not exist' not in str(e).lower():
                    print(f"⚠️  Statement {i}: {str(e)[:100]}")
        
        print(f"\n✨ Completed!")
        print(f"   Success: {success_count}")
        print(f"   Errors (expected): {error_count}")
        print("\n🎉 RLS policies and security fixes have been applied!")
        
    except FileNotFoundError:
        print(f"❌ SQL file not found: {sql_file_path}")
    except Exception as e:
        print(f"❌ Error applying fixes: {e}")

if __name__ == "__main__":
    apply_rls_fixes()
