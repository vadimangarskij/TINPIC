#!/usr/bin/env python3
"""
Backend API Testing Script for ConnectSphere Admin Payment Settings
Tests the newly created admin endpoints for payment settings and transactions.
"""

import requests
import json
import random
import sys
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8001/api"
TEST_EMAIL = f"admin{random.randint(1000, 9999)}@test.com"
TEST_USERNAME = f"admin{random.randint(1000, 9999)}"
TEST_PASSWORD = "AdminPass123!"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_success(message):
    print(f"{Colors.GREEN}✅ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.RED}❌ {message}{Colors.ENDC}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠️  {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ️  {message}{Colors.ENDC}")

def print_header(message):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*50}")
    print(f"🧪 {message}")
    print(f"{'='*50}{Colors.ENDC}")

def make_request(method, endpoint, headers=None, data=None, params=None):
    """Make HTTP request and return response with error handling"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method.upper() == 'GET':
            response = requests.get(url, headers=headers, params=params, timeout=10)
        elif method.upper() == 'POST':
            response = requests.post(url, headers=headers, json=data, timeout=10)
        elif method.upper() == 'PUT':
            response = requests.put(url, headers=headers, json=data, timeout=10)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        return response
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {e}")
        return None

def test_health_check():
    """Test health endpoint"""
    print_header("Health Check")
    
    response = make_request('GET', '/health')
    if response is None:
        print_error("Health check failed - no response")
        return False
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Health check passed (Status: {response.status_code})")
        print_info(f"Supabase connected: {data.get('supabase_connected', False)}")
        print_info(f"AI service ready: {data.get('ai_service_ready', False)}")
        return True
    else:
        print_error(f"Health check failed (Status: {response.status_code})")
        return False

def register_and_login():
    """Register a test user and get auth token"""
    print_header("Authentication Setup")
    
    # Register user
    user_data = {
        "email": TEST_EMAIL,
        "username": TEST_USERNAME,
        "password": TEST_PASSWORD,
        "full_name": "Admin Test User",
        "gender": "male",
        "date_of_birth": "1990-01-01"
    }
    
    print_info(f"Registering user: {TEST_EMAIL}")
    response = make_request('POST', '/auth/register', data=user_data)
    
    if response is None or response.status_code != 200:
        print_error(f"Registration failed (Status: {response.status_code if response else 'No response'})")
        if response:
            print_error(f"Error: {response.text}")
        return None
    
    print_success("User registered successfully")
    
    # Login to get token
    login_data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    
    print_info("Logging in to get auth token...")
    response = make_request('POST', '/auth/login', data=login_data)
    
    if response is None or response.status_code != 200:
        print_error(f"Login failed (Status: {response.status_code if response else 'No response'})")
        if response:
            print_error(f"Error: {response.text}")
        return None
    
    data = response.json()
    token = data.get('access_token')
    
    if token:
        print_success("Login successful - token obtained")
        return token
    else:
        print_error("Login response missing access token")
        return None

def test_admin_settings_get(auth_headers):
    """Test GET /api/admin/settings"""
    print_header("Testing GET /api/admin/settings")
    
    response = make_request('GET', '/admin/settings', headers=auth_headers)
    
    if response is None:
        print_error("GET /admin/settings - No response")
        return False
    
    if response.status_code == 200:
        try:
            data = response.json()
            print_success(f"GET /admin/settings passed (Status: {response.status_code})")
            print_info(f"Response type: {type(data)}")
            print_info(f"Settings count: {len(data) if isinstance(data, dict) else 'N/A'}")
            
            # Pretty print first few settings
            if isinstance(data, dict):
                print_info("Sample settings:")
                for i, (key, value) in enumerate(list(data.items())[:3]):
                    print(f"    {key}: {value}")
                if len(data) > 3:
                    print(f"    ... and {len(data) - 3} more")
            
            return True
        except json.JSONDecodeError:
            print_error("GET /admin/settings - Invalid JSON response")
            return False
    else:
        print_error(f"GET /admin/settings failed (Status: {response.status_code})")
        print_error(f"Response: {response.text}")
        return False

def test_admin_settings_post(auth_headers):
    """Test POST /api/admin/settings"""
    print_header("Testing POST /api/admin/settings")
    
    # Test setting a new setting - using query parameters as expected by the endpoint
    test_settings = [
        {"setting_key": "yoomoney_enabled", "setting_value": "true"},
        {"setting_key": "yoomoney_api_key", "setting_value": "test_api_key_123"},
        {"setting_key": "qiwi_enabled", "setting_value": "false"},
        {"setting_key": "telegram_stars_enabled", "setting_value": "true"}
    ]
    
    success_count = 0
    
    for setting in test_settings:
        print_info(f"Setting {setting['setting_key']} = {setting['setting_value']}")
        
        # Use query parameters instead of JSON body
        params = {
            "setting_key": setting['setting_key'],
            "setting_value": setting['setting_value']
        }
        
        response = make_request('POST', '/admin/settings', headers=auth_headers, params=params)
        
        if response is None:
            print_error(f"POST /admin/settings - No response for {setting['setting_key']}")
            continue
        
        if response.status_code == 200:
            try:
                data = response.json()
                if data.get('success'):
                    print_success(f"Setting {setting['setting_key']} saved successfully")
                    success_count += 1
                else:
                    print_error(f"Setting {setting['setting_key']} - Success flag is False")
            except json.JSONDecodeError:
                print_error(f"Setting {setting['setting_key']} - Invalid JSON response")
        else:
            print_error(f"Setting {setting['setting_key']} failed (Status: {response.status_code})")
            print_error(f"Response: {response.text}")
    
    if success_count == len(test_settings):
        print_success(f"POST /admin/settings - All {len(test_settings)} settings saved successfully")
        return True
    else:
        print_warning(f"POST /admin/settings - {success_count}/{len(test_settings)} settings saved")
        return success_count > 0

def test_admin_transactions_stats(auth_headers):
    """Test GET /api/admin/transactions/stats"""
    print_header("Testing GET /api/admin/transactions/stats")
    
    response = make_request('GET', '/admin/transactions/stats', headers=auth_headers)
    
    if response is None:
        print_error("GET /admin/transactions/stats - No response")
        return False
    
    if response.status_code == 200:
        try:
            data = response.json()
            print_success(f"GET /admin/transactions/stats passed (Status: {response.status_code})")
            
            # Check required fields
            required_fields = ['total', 'today', 'this_month', 'revenue', 'recent']
            missing_fields = []
            
            for field in required_fields:
                if field not in data:
                    missing_fields.append(field)
                else:
                    print_info(f"{field}: {data[field]}")
            
            if missing_fields:
                print_warning(f"Missing fields: {missing_fields}")
                return False
            
            # Validate data types
            if not isinstance(data['total'], int):
                print_warning("'total' should be a number")
            if not isinstance(data['today'], int):
                print_warning("'today' should be a number")
            if not isinstance(data['this_month'], int):
                print_warning("'this_month' should be a number")
            if not isinstance(data['revenue'], (int, float)):
                print_warning("'revenue' should be a number")
            if not isinstance(data['recent'], list):
                print_warning("'recent' should be an array")
            
            print_success("Transaction stats structure is valid")
            return True
            
        except json.JSONDecodeError:
            print_error("GET /admin/transactions/stats - Invalid JSON response")
            return False
    else:
        print_error(f"GET /admin/transactions/stats failed (Status: {response.status_code})")
        print_error(f"Response: {response.text}")
        return False

def test_admin_transactions_list(auth_headers):
    """Test GET /api/admin/transactions"""
    print_header("Testing GET /api/admin/transactions")
    
    # Test with default parameters
    print_info("Testing with default parameters...")
    response = make_request('GET', '/admin/transactions', headers=auth_headers)
    
    if response is None:
        print_error("GET /admin/transactions - No response")
        return False
    
    if response.status_code == 200:
        try:
            data = response.json()
            print_success(f"GET /admin/transactions passed (Status: {response.status_code})")
            
            # Check required fields
            required_fields = ['transactions', 'total', 'limit', 'offset']
            missing_fields = []
            
            for field in required_fields:
                if field not in data:
                    missing_fields.append(field)
                else:
                    if field == 'transactions':
                        print_info(f"{field}: array with {len(data[field])} items")
                    else:
                        print_info(f"{field}: {data[field]}")
            
            if missing_fields:
                print_warning(f"Missing fields: {missing_fields}")
                return False
            
            # Validate transactions array
            if not isinstance(data['transactions'], list):
                print_error("'transactions' should be an array")
                return False
            
            # Test with custom parameters
            print_info("Testing with custom parameters (limit=10, offset=0)...")
            params = {'limit': 10, 'offset': 0}
            response2 = make_request('GET', '/admin/transactions', headers=auth_headers, params=params)
            
            if response2 and response2.status_code == 200:
                data2 = response2.json()
                print_success("Custom parameters test passed")
                print_info(f"Limit: {data2.get('limit')}, Offset: {data2.get('offset')}")
            else:
                print_warning("Custom parameters test failed")
            
            # Test with status filter
            print_info("Testing with status filter...")
            params = {'status': 'completed'}
            response3 = make_request('GET', '/admin/transactions', headers=auth_headers, params=params)
            
            if response3 and response3.status_code == 200:
                print_success("Status filter test passed")
            else:
                print_warning("Status filter test failed")
            
            return True
            
        except json.JSONDecodeError:
            print_error("GET /admin/transactions - Invalid JSON response")
            return False
    else:
        print_error(f"GET /admin/transactions failed (Status: {response.status_code})")
        print_error(f"Response: {response.text}")
        return False

def test_settings_persistence(auth_headers):
    """Test that settings are actually saved and can be retrieved"""
    print_header("Testing Settings Persistence")
    
    # Save a unique setting
    unique_key = f"test_setting_{random.randint(1000, 9999)}"
    unique_value = f"test_value_{random.randint(1000, 9999)}"
    
    print_info(f"Saving setting: {unique_key} = {unique_value}")
    
    # Save the setting
    save_data = {"setting_key": unique_key, "setting_value": unique_value}
    response = make_request('POST', '/admin/settings', headers=auth_headers, data=save_data)
    
    if response is None or response.status_code != 200:
        print_error("Failed to save test setting")
        return False
    
    print_success("Test setting saved")
    
    # Retrieve all settings
    print_info("Retrieving all settings to verify persistence...")
    response = make_request('GET', '/admin/settings', headers=auth_headers)
    
    if response is None or response.status_code != 200:
        print_error("Failed to retrieve settings")
        return False
    
    data = response.json()
    
    if unique_key in data and data[unique_key] == unique_value:
        print_success("Settings persistence test passed - setting found with correct value")
        return True
    else:
        print_error(f"Settings persistence test failed - setting not found or incorrect value")
        print_error(f"Expected: {unique_key} = {unique_value}")
        print_error(f"Found: {data.get(unique_key, 'NOT FOUND')}")
        return False

def run_all_tests():
    """Run all admin payment settings tests"""
    print(f"{Colors.BOLD}{Colors.BLUE}")
    print("🚀 ConnectSphere Admin Payment Settings API Tests")
    print("=" * 60)
    print(f"Backend URL: {BASE_URL}")
    print(f"Test User: {TEST_EMAIL}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("=" * 60)
    print(f"{Colors.ENDC}")
    
    # Track test results
    test_results = {}
    
    # 1. Health Check
    test_results['health'] = test_health_check()
    
    # 2. Authentication
    token = register_and_login()
    if not token:
        print_error("Authentication failed - cannot proceed with admin tests")
        return False
    
    auth_headers = {"Authorization": f"Bearer {token}"}
    test_results['auth'] = True
    
    # 3. Admin Settings Tests
    test_results['admin_settings_get'] = test_admin_settings_get(auth_headers)
    test_results['admin_settings_post'] = test_admin_settings_post(auth_headers)
    test_results['settings_persistence'] = test_settings_persistence(auth_headers)
    
    # 4. Admin Transactions Tests
    test_results['admin_transactions_stats'] = test_admin_transactions_stats(auth_headers)
    test_results['admin_transactions_list'] = test_admin_transactions_list(auth_headers)
    
    # Summary
    print_header("Test Results Summary")
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results.items():
        if result:
            print_success(f"{test_name}: PASSED")
            passed += 1
        else:
            print_error(f"{test_name}: FAILED")
    
    print(f"\n{Colors.BOLD}")
    if passed == total:
        print(f"{Colors.GREEN}🎉 All tests passed! ({passed}/{total}){Colors.ENDC}")
        return True
    else:
        print(f"{Colors.YELLOW}⚠️  {passed}/{total} tests passed{Colors.ENDC}")
        return False

if __name__ == "__main__":
    try:
        success = run_all_tests()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Test interrupted by user{Colors.ENDC}")
        sys.exit(1)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        sys.exit(1)