# BuildHub - Full Product Manual & Technical Documentation

Welcome to the **BuildHub** Master Manual. This document serves as the single source of truth for developers and operators of the BuildHub construction ecosystem.

---

## 1. Product Overview
BuildHub is a digital operating system for the construction industry. It bridges the gap between site management, material procurement, and client communication.

### Core Modules:
- **Identity & Profiles**: Role-based access for Contractors, Suppliers, and Clients.
- **Project Engine**: Tracking milestones and project health.
- **Marketplace**: B2B material sourcing.
- **Financial Module**: BOQ (Bill of Quantities) and Invoice generation.

---

## 2. System Architecture

BuildHub uses a **Distributed Full-Stack Architecture**:

### Frontend (Client-Side)
- **Framework**: React 19 + TypeScript.
- **Styling**: Tailwind CSS 4.0.
- **State Management**: React Hooks + Supabase Auth Observers.
- **Animations**: Motion (framer-motion).

### Backend (Server-Side)
- **Logic Tier**: Express.js running on Node.js (Port 3000).
- **Persistence Tier**: Supabase (PostgreSQL).
- **Auth Tier**: Supabase Auth (GoTrue).
- **Security Tier**: Supabase RLS (Row Level Security).

---

## 3. Folder Structure & Key Files

```text
/
├── server.ts                 # Express Backend Entry Point
├── GUIDE.md                  # Installation & Quick-start
├── RAILWAY_DEPLOYMENT.md     # Dedicated Deployment Guide
├── MANUAL.md                 # This file
│
├── src/
│   ├── main.tsx              # React Entry Point
│   ├── App.tsx               # Main UI & Route Logic
│   ├── lib/
│   │   └── supabase.ts       # Backend connection & auth helpers
│   └── components/           # Reusable UI Atoms (to be expanded)
│
├── dist/                     # Production Build Output (generated)
└── package.json              # Dependency & Script Manifest
```

---

## 4. Key Functions & Logic

### Authentication (`src/lib/supabase.ts`)
- `signInWithGoogle()`: Triggers the Supabase OAuth flow.
- `logOut()`: Clears the session.
- `onAuthStateChange()`: A listener that updates the UI state globally whenever a user signs in or out.

### Database Operations (`src/lib/supabase.ts`)
- **Table Logic**:
  - `profiles`: User metadata and roles.

### Backend API (`server.ts`)
- `/api/health`: Used by load balancers and the frontend to verify server uptime.
- `/api/verify-company`: A placeholder for server-side business verification logic.

---

## 5. Security Model
BuildHub enforces security at the database level using Supabase Row Level Security (RLS):

1. **The Owner Gate**: For any update to a profile, the system checks if the `id` matches the authenticated user:
   `auth.uid() = id`
2. **Immutability**: Once a user ID is set, it can never be changed via the frontend.

---

## 6. How to Use the App

### For Contractors:
1. **Sign In**: Use your Google account.
2. **Setup Profile**: Create your company profile to appear in the directory.
3. **Manage Projects**: Use the dashboard to track your active construction sites.

### For Suppliers:
1. **List Materials**: Add products to the marketplace.
2. **Track leads**: Receive messages from contractors looking for quotes.

### For Clients:
1. **Post Tenders**: Describe your construction needs and budget.
2. **Pay Invoices**: View and manage project billing.

---

## 7. Troubleshooting
- **Permission Denied**: This usually means you are trying to edit data that doesn't belong to you.
- **Server Error**: Check the `GUIDE.md` to ensure your `.env` variables are correctly set.

---
*End of Manual*
