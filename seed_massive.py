import requests
import random
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5152/api"

# Elite content generation lists
categories = ["Food", "Wellness", "Gym", "Activity", "Coaching"]
locations = ["Mumbai South", "Bandra West", "Juhu", "Powai", "Worli", "Colaba", "Andheri Elite"]
offer_verbs = ["Exclusive", "Premium", "Elite", "Ultimate", "Midnight", "Sunrise", "Royal"]
offer_nouns = {
    "Food": ["Brunch Buffet", "Sushi Experience", "Chef's Table", "Wine Tasting", "Rooftop Dinner"],
    "Wellness": ["Spa Retreat", "Yoga Flow", "Meditation session", "Ayurvedic Massage", "Healing Therapy"],
    "Gym": ["Crossfit Trial", "Personal Training", "HIIT Blast", "Kickboxing Masterclass", "Body Sculpt"],
    "Activity": ["Turf Football", "Bowling Night", "Gaming Marathon", "Paintball War", "Karaoke VIP"],
    "Coaching": ["Tennis Pro", "Swimming Advance", "Guitar Workshop", "Chess Masterclass", "Coding Sprint"]
}

def seed_massive_data():
    print("🚀 Initializing Massive Data Seeding (100+ Offers)...")
    
    # 1. Authenticate
    admin_payload = {"name": "Admin User", "email": "admin@example.com", "password": "AdminPassword123"}
    requests.post(f"{BASE_URL}/auth/register?role=Admin", json=admin_payload)
    login_resp = requests.post(f"{BASE_URL}/auth/login", json=admin_payload)
    
    if login_resp.status_code != 200:
        print(f"❌ Auth Failed: {login_resp.text}")
        return

    token = login_resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Admin Authenticated.")

    # 2. Get/Create Business
    bus_resp = requests.get(f"{BASE_URL}/business")
    if bus_resp.status_code != 200:
        business_payload = {
            "name": "Willovate Elite Network",
            "businessType": "Luxury Group",
            "ownerName": "Enoch Jason",
            "phone": "9998887770",
            "email": "concierge@willovate.com",
            "address": "Elite Business District",
            "city": "Mumbai",
            "openingTime": "05:00",
            "closingTime": "23:59"
        }
        bus_resp = requests.post(f"{BASE_URL}/business", json=business_payload, headers=headers)
    
    business_id = bus_resp.json()["id"]

    # 3. Generate 100 Unique Offers
    print(f"🏷️ Generating 105 Unique Elite Offers...")
    
    today = datetime.now()
    
    for i in range(105):
        category = random.choice(categories)
        verb = random.choice(offer_verbs)
        noun = random.choice(offer_nouns[category])
        title = f"{verb} {noun}"
        
        orig_price = random.randint(10, 50) * 100 # 1000 - 5000
        discount = random.choice([30, 40, 50, 60, 70, 80])
        offer_price = int(orig_price * (1 - discount/100))
        
        start_date = (today + timedelta(days=random.randint(-5, 2))).strftime("%Y-%m-%d")
        end_date = (today + timedelta(days=random.randint(15, 60))).strftime("%Y-%m-%d")
        
        offer_data = {
            "businessId": business_id,
            "title": title,
            "description": f"Experience the {title} at {random.choice(locations)}. This limited-time offer includes priority access and exclusive amenities for our premium members.",
            "category": category,
            "originalPrice": orig_price,
            "offerPrice": offer_price,
            "discountPercentage": discount,
            "startDate": start_date,
            "endDate": end_date,
            "termsAndConditions": "1. Valid for app members only.\n2. Non-refundable once booked.\n3. Arrive 15 mins early.",
            "status": "Active"
        }

        off_resp = requests.post(f"{BASE_URL}/offers", json=offer_data, headers=headers)
        if off_resp.status_code in [200, 201]:
            offer_id = off_resp.json()["id"]
            if i % 10 == 0:
                print(f"   📈 Progress: {i}/105 offers created...")
            
            # Create 3-5 slots per offer
            for h in range(random.randint(2, 5)):
                start_h = 8 + (h * 3)
                slot_data = {
                    "offerId": offer_id,
                    "slotDate": (today + timedelta(days=random.randint(0, 7))).strftime("%Y-%m-%d"),
                    "startTime": f"{start_h:02d}:00",
                    "endTime": f"{(start_h+2):02d}:00",
                    "capacity": random.randint(5, 20)
                }
                requests.post(f"{BASE_URL}/slots", json=slot_data, headers=headers)
        else:
            print(f"❌ Failed on index {i}: {off_resp.text}")

    print("\n💎 DATABASE SCALED: 100+ unique offers with slots successfully generated.")
    print("🚀 Check your homepage now for the infinite elite scroll experience!")

if __name__ == "__main__":
    seed_massive_data()
