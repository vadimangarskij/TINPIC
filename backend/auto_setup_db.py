"""
Automatic Supabase Database Setup
Uses Management API with Access Token
"""
import os
import sys
import requests
import time
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
ACCESS_TOKEN = "sbp_ce3901655c9174557164fe06f4c493ec3097c825"

# Extract project ref from URL
PROJECT_REF = SUPABASE_URL.split("//")[1].split(".")[0]

print("="*70)
print("🚀 SUPABASE DATABASE AUTO SETUP")
print("="*70)
print(f"📍 Project: {PROJECT_REF}")
print(f"🔗 URL: {SUPABASE_URL}")
print("="*70)

def execute_sql_via_api(sql_query):
    """Execute SQL using Supabase Management API"""
    
    url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"
    
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "query": sql_query
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        if response.status_code in [200, 201]:
            return True, "Success"
        elif response.status_code == 400:
            # Some errors are OK (like "already exists")
            error_text = response.text.lower()
            if "already exists" in error_text or "duplicate" in error_text:
                return True, "Already exists (OK)"
            return False, f"Error 400: {response.text[:200]}"
        else:
            return False, f"HTTP {response.status_code}: {response.text[:200]}"
            
    except Exception as e:
        return False, f"Exception: {str(e)}"

def read_sql_file(filepath):
    """Read and clean SQL file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove comments and split by semicolon
    lines = []
    for line in content.split('\n'):
        line = line.strip()
        if line and not line.startswith('--'):
            lines.append(line)
    
    content = ' '.join(lines)
    
    # Split into statements
    statements = []
    for stmt in content.split(';'):
        stmt = stmt.strip()
        if stmt and len(stmt) > 10:  # Skip very short statements
            statements.append(stmt)
    
    return statements

def execute_statements(statements, description):
    """Execute a list of SQL statements"""
    print(f"\n{'='*70}")
    print(f"📝 {description}")
    print(f"{'='*70}")
    print(f"Total statements: {len(statements)}")
    
    success = 0
    errors = 0
    skipped = 0
    
    for i, stmt in enumerate(statements, 1):
        # Show progress
        if i % 5 == 0 or i == 1:
            print(f"⏳ Progress: {i}/{len(statements)}...", end='\r')
        
        # Execute statement
        result, message = execute_sql_via_api(stmt)
        
        if result:
            success += 1
            if "already exists" in message.lower():
                skipped += 1
        else:
            errors += 1
            # Print first few errors
            if errors <= 3:
                print(f"\n❌ Statement {i} failed: {message}")
                print(f"   SQL preview: {stmt[:100]}...")
        
        # Small delay to avoid rate limiting
        time.sleep(0.1)
    
    print(f"\n✅ Success: {success} | ❌ Errors: {errors} | ⏭️  Skipped: {skipped}")
    return success, errors

def main():
    """Main setup process"""
    
    total_success = 0
    total_errors = 0
    
    # Step 1: Create tables
    print("\n" + "🎯 STEP 1: CREATING TABLES AND FUNCTIONS")
    statements = read_sql_file('/app/supabase/minimal_migration.sql')
    s, e = execute_statements(statements, "Creating Database Schema")
    total_success += s
    total_errors += e
    
    print("\n⏸️  Waiting 3 seconds before applying RLS...")
    time.sleep(3)
    
    # Step 2: Apply RLS
    print("\n" + "🎯 STEP 2: APPLYING RLS AND SECURITY POLICIES")
    statements = read_sql_file('/app/supabase/fix_rls_and_policies.sql')
    s, e = execute_statements(statements, "Applying Row Level Security")
    total_success += s
    total_errors += e
    
    # Final results
    print("\n" + "="*70)
    print("📊 FINAL RESULTS")
    print("="*70)
    print(f"✅ Total Successful: {total_success}")
    print(f"❌ Total Errors: {total_errors}")
    
    if total_errors < 10:
        print("\n🎉 DATABASE SETUP COMPLETE!")
        print("\n✅ Next steps:")
        print("   1. Open Supabase Dashboard → Table Editor")
        print("   2. Verify tables are created")
        print("   3. Check Database → Advisors (should show no critical errors)")
        print("   4. Test registration in the app")
        return 0
    else:
        print("\n⚠️  SETUP COMPLETED WITH ERRORS")
        print("   Some errors are normal (like 'already exists')")
        print("   Check Supabase Dashboard to verify tables were created")
        return 1

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
