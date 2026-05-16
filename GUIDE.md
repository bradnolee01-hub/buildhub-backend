# BuildHub - Construction Office Platform Backend Guide

This guide provides comprehensive instructions for installing, testing, and deploying the BuildHub backend.

## 1. Architecture Overview
BuildHub uses a **Full-Stack Architecture**:
- **BaaS**: Supabase (PostgreSQL & Authentication) for data storage and user management.
- **Custom Server**: Express.js (Node.js) for custom API logic and serving the application.
- **Database**: PostgreSQL with Row Level Security (RLS) for fine-grained access control.

## 2. Prerequisites
- Node.js (v18+)
- npm or yarn
- A Supabase Project (Create one at supabase.com)

## 3. Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file based on `.env.example`.
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   - Ensure `GEMINI_API_KEY` is set for AI features.

## 4. Backend Components

### A. Supabase RLS Policies
The backend logic is primarily enforced by PostgreSQL RLS policies. These ensure:
- **Identity Integrity**: Users can only modify their own profiles.
- **State Locking**: Finalized data cannot be modified by the client.

### B. Custom API (Express)
The `server.ts` file handles:
- Health checks.
- Custom business logic that requires server-side validation.
- Serving static frontend assets in production.

## 5. Testing
1. **Local Development**:
   ```bash
   npm run dev
   ```
   The backend will start at `http://localhost:3000`.
2. **API Testing**:
   Use `curl` or Postman to test the health endpoint:
   ```bash
   curl http://localhost:3000/api/health
   ```
3. **Database Testing**:
   Use the Supabase SQL editor to verify Row Level Security (RLS) policies.

## 6. Frontend Integration
The frontend interacts with the backend through:
1. **Supabase SDK**: For direct database updates and auth listeners.
2. **REST API**: For server-side operations.

Example Integration (`src/lib/supabase.ts`):
```typescript
import { supabase } from './supabase';

// Creating a profile
async function createProfile(data) {
  return await supabase.from('profiles').insert([data]);
}
```

## 7. Deployment
1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Deploy to Cloud Run (or similar)**:
   The `start` command in `package.json` (`node dist/server.cjs`) is configured for production environments.

---
*Created by BuildHub Engineering*
