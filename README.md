# 🏆 SmartOffer: Enterprise-Grade Elite Slot Booking System

[![Project Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen)](https://github.com/)
[![Backend](https://img.shields.io/badge/Backend-.NET%2010%20%2F%208-blue)](https://dotnet.microsoft.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb)](https://reactjs.org/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38b2ac)](https://tailwindcss.com/)

**SmartOffer** is a high-performance, fullstack digital marketplace designed for luxury service providers to manage exclusive, time-bound offers. Built with the **Awwwards Standard** of visual excellence and powered by an enterprise-grade .NET backend.

---

## 🏛️ Comprehensive System Architecture

### **1. Multilayered Infrastructure Diagram**
This diagram illustrates the request journey from the edge down to the persistent storage, highlighting the performance and security middleware.

```mermaid
graph TD
    subgraph "Client Layer (Vite + React 18)"
        UI[React Components]
        RQ[TanStack Query Cache]
        AX[Axios Interceptors]
    end

    subgraph "Edge & Security Layer (Middleware)"
        RL[FixedWindow Rate Limiter]
        OC[Output Cache Layer]
        AU[JWT Bearer Auth Handler]
        CO[CORS Policy Engine]
    end

    subgraph "Application Core (.NET 10)"
        CTRL[REST Controllers]
        SVC[Domain Services]
        HASH[Deterministic Image Engine]
    end

    subgraph "Persistence Layer (PostgreSQL)"
        EF[EF Core ORM]
        DB[(PostgreSQL 18)]
    end

    UI -->|1. Interactive Event| RQ
    RQ -->|2. Cache Miss| AX
    AX -->|3. Signed Request| RL
    RL -->|4. Pass| OC
    OC -->|5. Auth Check| AU
    AU -->|6. Authorized| CTRL
    CTRL -->|7. Business Logic| SVC
    SVC -->|8. Transactional Unit| EF
    EF -->|9. Query/Command| DB
    HASH -.->|Map ID to Visual| UI
```

### **2. Entity Relationship Diagram (ERD)**
Detailed schema mapping showing the relational integrity and foreign key constraints enforced by Entity Framework Core.

```mermaid
erDiagram
    USER ||--o{ BOOKING : "places"
    BUSINESS ||--o{ OFFER : "manages"
    OFFER ||--o{ OFFER_SLOT : "contains"
    OFFER ||--o{ BOOKING : "reserved_in"
    OFFER_SLOT ||--o{ BOOKING : "scheduled_for"

    USER {
        uuid id PK
        string name
        string email
        string password_hash
        enum role
    }

    BUSINESS {
        uuid id PK
        string name
        string business_type
        time opening_time
        time closing_time
    }

    OFFER {
        uuid id PK
        uuid business_id FK
        decimal original_price
        decimal offer_price
        int discount_pct
        date end_date
        enum status
    }

    OFFER_SLOT {
        uuid id PK
        uuid offer_id FK
        time start_time
        time end_time
        int capacity
        int booked_count
    }

    BOOKING {
        uuid id PK
        uuid user_id FK
        uuid offer_id FK
        uuid slot_id FK
        string reference_code
        enum status
    }
```

### **3. RBAC Security Sequence**
Ensures that access control is enforced at both the UI layer (via JWT decoding) and the API layer (via Role-based claims).

```mermaid
sequenceDiagram
    participant U as User (Attacker/Customer)
    participant F as React App (Guard)
    participant B as .NET API (Security)
    participant DB as PostgreSQL

    U->>F: Navigate to /admin/offers/create
    F->>F: Decode JWT Token Payload
    alt Role != 'Admin'
        F-->>U: Redirect to / (Unauthorized)
    else Role == 'Admin'
        F->>U: Render Create Offer Page
        U->>F: Submit Offer Data
        F->>B: POST /api/offers (with JWT)
        B->>B: Validate JWT & Role Claim
        alt Authorized (Admin)
            B->>DB: Save Offer
            B-->>F: 201 Created
        else Unauthorized (Customer)
            B-->>F: 403 Forbidden
        end
    end
```

---

## 🔄 Critical Workflow Orchestration

### **1. Secure Reservation Workflow (Transactional)**
This sequence demonstrates how the system maintains data integrity under load, ensuring no overbooking occurs.

```mermaid
sequenceDiagram
    participant U as Elite Customer
    participant F as React Frontend
    participant B as .NET API
    participant C as Output Cache
    participant DB as PostgreSQL

    U->>F: Select Slot (e.g. 10:00 AM)
    F->>B: POST /api/bookings (JWT Token)
    Note over B: Rate Limiter & Auth check
    B->>DB: Begin Transaction
    B->>DB: Check Slot Capacity & Lock
    alt Slots Available
        B->>DB: Create Booking Record
        B->>DB: Increment BookedCount
        B->>DB: Commit Transaction
        B->>C: Evict Tag: "offers"
        B-->>F: 201 Created (QR Data)
        F-->>U: Success (Confirmation Page)
    else Capacity Full
        B->>DB: Rollback
        B-->>F: 400 Bad Request
        F-->>U: Error: "Slot Filled"
    end
```

### **2. New Offer & Slot Orchestration**
Transactional integrity for merchant content creation, ensuring slots are never orphaned.

```mermaid
sequenceDiagram
    participant A as Admin Merchant
    participant F as React Frontend
    participant B as .NET API
    participant C as Output Cache
    participant DB as PostgreSQL

    A->>F: Input Offer & Slot Data
    F->>B: POST /api/offers (JWT Token)
    Note over B: Role Check: Admin Only
    B->>DB: Begin Transaction
    B->>DB: Save Offer Entity
    loop For each slot
        B->>DB: Save OfferSlot Entity
    end
    B->>DB: Commit Transaction
    B->>C: Evict Tag: "offers"
    B-->>F: 201 Created
    F->>A: Redirect to /admin/offers
```

### **3. Deterministic Image Hashing Logic**
To ensure an "Awwwards" aesthetic without heavy backend processing or duplicate visuals, we use a deterministic client-side engine.

```mermaid
graph LR
    ID[Offer Unique ID] --> H[Hash Algorithm]
    CAT[Category] --> H
    H --> P[ID Pool Match]
    P --> URL[Final Unsplash URL]
    URL -->|Cacheable| IMG[Cinematic Card Visual]
```

---

## 🛠️ Comprehensive API Reference

### **Authentication & RBAC**
| Endpoint | Method | Role | Logic Detail |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | **Strictly `Customer`**. Role escalation via query param is disabled. |
| `/api/auth/login` | `POST` | Public | Returns `RS256` signed JWT. |

### **High-Performance Offer Engine**
| Endpoint | Method | Role | Logic Detail |
| :--- | :--- | :--- | :--- |
| `/api/offers` | `GET` | Public | **Output Cached (60s)**. Tagged for smart eviction. |
| `/api/offers/{id}` | `GET` | Public | Eagerly loads Business & Slot entities. |
| `/api/offers` | `POST` | Admin | Triggers `IOutputCacheStore.EvictByTagAsync("offers")`. |

### **Booking & Analytics**
| Endpoint | Method | Role | Logic Detail |
| :--- | :--- | :--- | :--- |
| `/api/bookings` | `POST` | All | Automated link to `UserId` if claims are present. |
| `/api/customer/bookings`| `GET` | Customer | Filters by `ClaimTypes.NameIdentifier`. |
| `/api/dashboard/summary`| `GET` | Admin | Optimized LINQ aggregation for real-time stats. |

---

## 🚀 Engineering Setup

### **1. Runtimes**
-   **.NET 10 SDK** (Core API)
-   **Node.js v22+** (React/Vite)
-   **PostgreSQL 18** (Relational Store)

### **2. Quick Deployment**
```bash
# Database Setup
createdb smart_offer_booking
cd backend && dotnet ef database update

# Scaling Test Data (Massive Seeder)
python3 seed_massive.py # Generates 100+ unique high-end offers

# Execution
cd backend && dotnet run # Port 5152
cd frontend && npm run dev # Port 5173
```

---

## 💎 Visual Excellence Standards
-   **Glass-morphism:** Utilizes `backdrop-blur-3xl` for high-end refraction.
-   **Animated Background:** Living Mesh Gradient engine with **SVG Film Grain** textures.
-   **Editorial Layout:** 4:5 aspect ratio card systems inspired by **Awwwards E-commerce** showcases.

---
*Developed for the Willovate Hackathon 2026. Designed for the Future.* 🚀🏆
