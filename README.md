# Smart Offer Slot Booking System

A fullstack web application for businesses to manage limited-time offers and for customers to book them.

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS v4, Vite, React Router, TanStack Query.
- **Backend:** .NET 8/10 Web API, Entity Framework Core.
- **Database:** PostgreSQL.

## Prerequisites
- .NET 10 SDK
- Node.js (v20+)
- PostgreSQL (v18+)

## Setup Instructions

### 1. Database Setup
Ensure PostgreSQL is running and run the following command to create the database:
```bash
createdb smart_offer_booking
```
The connection string is configured in `backend/appsettings.json`.

### 2. Backend Setup
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```
The API will be available at `http://localhost:5152`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## Features
- **Admin Portal:** Login, Dashboard stats, Offer management, Booking management.
- **Public Page:** Filterable offer listing, detailed offer view with slot selection, and booking confirmation.
- **Business Rules:** Capacity validation, price validation, offer expiry, and unique booking references.
