# BuildHub - Frontend Integration Specs (Vercel Ready)

This document is designed for frontend developers to understand the backend architecture, security constraints, and integration patterns for BuildHub.

## 1. Environment & Config
The app uses **Supabase** for data/auth and an **Express** server for custom logic. 

### Vercel/Supabase Environment Variables
Ensure these are configured:
- `VITE_GEMINI_API_KEY`: Required for AI features.
- `VITE_SUPABASE_URL`: Your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key.
- `VITE_API_URL`: The URL of your Railway backend (e.g. `https://xxx.up.railway.app`).
- `APP_URL`: The production URL of your deployment.

---

## 2. Authentication Flow

BuildHub uses local email/password authentication. The integration logic is in `src/App.tsx`.

### Email/Password
- **Concept**: Users sign up with email and password. To prevent platform abuse, they must provide a valid business identity link.
- **Form Requirement**: Mandatory `fullName`, `email`, `password`, `role`, and `website`.
- **Identity Links**: The `website` field explicitly accepts standard business websites, LinkedIn profiles, or Facebook business pages.
- **Logic**: 
  1. `supabase.auth.signUp`.
  2. Create entry in `profiles` table.

---

## 3. Database Schema (PostgreSQL)

| Table | Entity | Key Fields | Access Control |
|------------|--------|------------|----------------|
| `profiles` | User Profile | `id`, `display_name`, `role`, `website`, `auth_method` | Only Owner can read/write their own (RLS). |

---

## 4. Security Model (RLS)

Security is enforced at the database level using Supabase Row Level Security (RLS).

- **Identity Locking**: Users can only insert/update records where the `id` matches `auth.uid()`.
- **Validation**: Ensure data integrity via check constraints and types in PostgreSQL.

---

## 5. Custom Backend API (Express)

The Express server (`server.ts`) handles logic that cannot be done on the client.

- `GET /api/health`: Returns 200 OK. Used to verify the backend container is alive.
- `POST /api/verify-company`: `{ companyId: string }`. Used for official business verification logic.

---

## 6. Integration Best Practices

### Real-time Sync
Prefer `supabase.from(...).on(...)` for real-time updates if needed.

### Profile Readiness
Always check for the existence of the `profiles` entry after user session is established. If missing, the user is in an "Un-onboarded" state and should be redirected to the onboarding form.

---
*BuildHub Technical Specs v1.3 (Local Auth & Social Links)*
