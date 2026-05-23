import requests
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5152/api"

def seed_data():
    print("🚀 Starting data seeding...")
    
    # 1. Create/Login Admin
    admin_payload = {
        "name": "Admin User",
        "email": "admin@example.com",
        "password": "AdminPassword123"
    }
    
    print("🔑 Authenticating...")
    # Try to register first, if fails assume exists and login
    requests.post(f"{BASE_URL}/auth/register", json=admin_payload)
    login_resp = requests.post(f"{BASE_URL}/auth/login", json=admin_payload)
    
    if login_resp.status_code != 200:
        print(f"❌ Failed to login: {login_resp.text}")
        return

    token = login_resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Authenticated successfully.")

    # 2. Create Business Profile
    print("🏢 Creating Business Profile...")
    business_payload = {
        "name": "Willovate Wellness Center",
        "businessType": "Gym",
        "ownerName": "Enoch Jason",
        "phone": "9876543210",
        "email": "contact@willovate.com",
        "address": "123 Tech Park, Silicon Valley",
        "city": "Mumbai",
        "openingTime": "06:00",
        "closingTime": "22:00"
    }
    
    # Check if business exists first (GET)
    bus_check = requests.get(f"{BASE_URL}/business")
    business_id = None
    if bus_check.status_code == 200:
        business_id = bus_check.json()["id"]
        print("ℹ️ Business already exists.")
    else:
        bus_resp = requests.post(f"{BASE_URL}/business", json=business_payload, headers=headers)
        if bus_resp.status_code in [200, 201]:
            business_id = bus_resp.json()["id"]
            print("✅ Business created.")
        else:
            print(f"❌ Failed to create business: {bus_resp.text}")
            return

    # 3. Create Sample Offers
    print("🏷️ Creating Sample Offers...")
    
    today = datetime.now()
    start_date = today.strftime("%Y-%m-%d")
    end_date = (today + timedelta(days=30)).strftime("%Y-%m-%d")

    offers = [
        {
            "businessId": business_id,
            "title": "Morning Yoga Session",
            "description": "Start your day with peace. Full access to our yoga studio and guidance from expert trainers.",
            "category": "Wellness",
            "originalPrice": 500.00,
            "offerPrice": 99.00,
            "discountPercentage": 80,
            "startDate": start_date,
            "endDate": end_date,
            "termsAndConditions": "Valid for first time visitors only.\nMust bring own yoga mat.",
            "status": "Active"
        },
        {
            "businessId": business_id,
            "title": "Healthy Brunch Buffet",
            "description": "Enjoy a nutritious and delicious buffet. Includes salads, fresh juices, and protein-packed mains.",
            "category": "Food",
            "originalPrice": 800.00,
            "offerPrice": 399.00,
            "discountPercentage": 50,
            "startDate": start_date,
            "endDate": end_date,
            "termsAndConditions": "Reservation required.\nValid on weekends only.",
            "status": "Active"
        },
        {
            "businessId": business_id,
            "title": "Personal Training Trial",
            "description": "One-on-one session with our certified trainers to smash your fitness goals.",
            "category": "Gym",
            "originalPrice": 1200.00,
            "offerPrice": 299.00,
            "discountPercentage": 75,
            "startDate": start_date,
            "endDate": end_date,
            "termsAndConditions": "Available for one-time use per customer.",
            "status": "Active"
        }
    ]

    for offer_data in offers:
        off_resp = requests.post(f"{BASE_URL}/offers", json=offer_data, headers=headers)
        if off_resp.status_code in [200, 201]:
            offer = off_resp.json()
            offer_id = offer["id"]
            print(f"✅ Created Offer: {offer['title']}")
            
            # 4. Create Slots for each offer
            print(f"   ⏰ Adding slots for '{offer['title']}'...")
            slots = [
                {"offerId": offer_id, "slotDate": start_date, "startTime": "08:00", "endTime": "09:00", "capacity": 10},
                {"offerId": offer_id, "slotDate": start_date, "startTime": "10:00", "endTime": "11:00", "capacity": 15},
                {"offerId": offer_id, "slotDate": start_date, "startTime": "17:00", "endTime": "18:00", "capacity": 8}
            ]
            for slot_data in slots:
                requests.post(f"{BASE_URL}/slots", json=slot_data, headers=headers)
        else:
            print(f"❌ Failed to create offer '{offer_data['title']}': {off_resp.text}")

    print("\n🎉 Seeding complete! You can now view the data on your dashboard and public pages.")
    print(f"Admin Login: {admin_payload['email']} / {admin_payload['password']}")

if __name__ == "__main__":
    seed_data()
