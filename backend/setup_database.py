"""
Automatic Database Setup Script for Supabase
Uses Management API to create tables and apply RLS policies
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
ACCESS_TOKEN = "sbp_ce3901655c9174557164fe06f4c493ec3097c825"

# Extract project ref from URL
PROJECT_REF = SUPABASE_URL.split("//")[1].split(".")[0]  # fhdtvadviuvxahsgrqyz

print(f"🚀 Starting database setup for project: {PROJECT_REF}")
print(f"📍 Supabase URL: {SUPABASE_URL}")

def execute_sql(sql_content, description):
    """Execute SQL via Supabase REST API"""
    print(f"\n{'='*60}")
    print(f"📝 {description}")
    print(f"{'='*60}")
    
    # Use PostgREST RPC endpoint
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Try direct SQL execution through PostgREST
    # First, let's try using the database directly
    import psycopg2
    
    try:
        # Build connection string from Supabase URL
        # Format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
        db_url = f"postgresql://postgres.{PROJECT_REF}:postgres@db.{PROJECT_REF}.supabase.co:5432/postgres"
        
        print("⏳ Connecting to database...")
        # We need the actual password - let's try using the service key as password
        # Supabase uses JWT for auth, so we'll use a different approach
        
        print("❌ Direct PostgreSQL connection requires password")
        print("🔄 Trying alternative method via SQL Editor API...")
        
        # Alternative: Use Supabase Management API
        management_url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"
        
        headers = {
            "Authorization": f"Bearer {ACCESS_TOKEN}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "query": sql_content
        }
        
        response = requests.post(management_url, headers=headers, json=payload)
        
        if response.status_code == 200 or response.status_code == 201:
            print(f"✅ {description} - Success!")
            return True
        else:
            print(f"⚠️  Status: {response.status_code}")
            print(f"Response: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def setup_database():
    """Main setup function"""
    
    print("\n" + "="*60)
    print("🎯 STEP 1: Creating Tables and Functions")
    print("="*60)
    
    # Read minimal migration
    with open('/app/supabase/minimal_migration.sql', 'r') as f:
        migration_sql = f.read()
    
    # Split into smaller chunks (API has limits)
    statements = [s.strip() for s in migration_sql.split(';') if s.strip() and not s.strip().startswith('--')]
    
    print(f"📊 Total statements to execute: {len(statements)}")
    
    success_count = 0
    error_count = 0
    
    # Execute in batches
    batch_size = 10
    for i in range(0, len(statements), batch_size):
        batch = statements[i:i+batch_size]
        batch_sql = ';\n'.join(batch) + ';'
        
        print(f"\n⏳ Executing batch {i//batch_size + 1}/{(len(statements) + batch_size - 1)//batch_size}...")
        
        if execute_sql(batch_sql, f"Batch {i//batch_size + 1}"):
            success_count += len(batch)
        else:
            error_count += len(batch)
    
    print("\n" + "="*60)
    print("🎯 STEP 2: Applying RLS and Security Policies")
    print("="*60)
    
    # Read RLS fixes
    with open('/app/supabase/fix_rls_and_policies.sql', 'r') as f:
        rls_sql = f.read()
    
    statements = [s.strip() for s in rls_sql.split(';') if s.strip() and not s.strip().startswith('--')]
    
    print(f"📊 Total RLS statements: {len(statements)}")
    
    # Execute RLS in batches
    for i in range(0, len(statements), batch_size):
        batch = statements[i:i+batch_size]
        batch_sql = ';\n'.join(batch) + ';'
        
        print(f"\n⏳ Executing RLS batch {i//batch_size + 1}/{(len(statements) + batch_size - 1)//batch_size}...")
        
        if execute_sql(batch_sql, f"RLS Batch {i//batch_size + 1}"):
            success_count += len(batch)
        else:
            error_count += len(batch)
    
    print("\n" + "="*60)
    print("📊 FINAL RESULTS")
    print("="*60)
    print(f"✅ Successful: {success_count}")
    print(f"❌ Errors: {error_count}")
    print("\n🎉 Database setup complete!")
    print("\nNext steps:")
    print("1. Check Supabase Dashboard → Table Editor")
    print("2. Verify Database → Advisors shows no errors")
    print("3. Test registration in the app")

if __name__ == "__main__":
    setup_database()
