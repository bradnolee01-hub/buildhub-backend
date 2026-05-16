# Railway Deployment Guide for BuildHub

Follow these steps to deploy BuildHub to Railway.app.

## 1. Export your Code
Since you are in AI Studio, you can get the full source code by:
1. Clicking the **Settings** (Gear Icon) in the top right.
2. Clicking **Export to ZIP**.
3. Unzip the file on your local machine.

## 2. Prepare GitHub
1. Create a new repository on GitHub.
2. Initialize git in your local project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

## 3. Configure Railway
1. Go to [Railway.app](https://railway.app/) and log in.
2. Click **+ New Project** -> **Deploy from GitHub repo**.
3. Select your `BuildHub` repository.

## 4. Environment Variables (CRITICAL)
Railway needs to know your Supabase credentials and API keys. Go to the **Variables** tab in your Railway service and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `GEMINI_API_KEY` | Your Google AI Studio API Key |
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anon Key |

## 5. Build & Start Settings
Railway should automatically detect the following from your `package.json`:
- **Build Command**: `npm run build`
- **Start Command**: `npm start` (Runs `node dist/server.cjs`)

## 6. Supabase Setup
1. Create a project at [Supabase.com](https://supabase.com/).
2. Go to **Project Settings -> API** to get your URL and Anon Key.
3. Add these to Railway variables as shown in Step 4.
4. Go to **Authentication -> Providers** and enable Google/Facebook.
5. In **Authentication -> Configuration -> URL Configuration**, add your Railway URL under "Redirect URLs".
6. In **Table Editor**, create a `profiles` table:
   - `id`: uuid (Primary Key, Foreign Key to auth.users.id)
   - `email`: text
   - `display_name`: text
   - `role`: text
   - `website`: text
   - `auth_method`: text
   - `created_at`: timestamptz (default now())

## 7. Troubleshooting "Server: ERROR"
If your app loads but shows "Server: ERROR" in the top bar:

1. **Check Environment Variables**: 
   - Ensure `NODE_ENV` is set to `production`.
2. **Browser Console**:
   - Press **F12** and go to the **Console** tab.
   - Look for "Supabase URL or Anon Key is missing".

---
*Guide generated for BuildHub Production Deployment*
