# AI Automation Opportunity Scanner - Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended)
1. Push this project to GitHub
2. Go to [railway.app](https://railway.app)
3. Connect your GitHub repo
4. Railway will auto-detect Next.js and deploy

### Option 2: Render
1. Push this project to GitHub
2. Go to [render.com](https://render.com)
3. Create a new "Web Service"
4. Connect your GitHub repo
5. Set build command: `npm run build`
6. Set start command: `npm run start`

### Option 3: Vercel
1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Vercel will auto-detect Next.js

### Option 4: Docker (Self-hosted)
```bash
docker build -t ai-scanner .
docker run -p 3000:3000 --env-file .env.local ai-scanner
```

## Environment Variables Required

Create a `.env` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Firecrawl
FIRECRAWL_API_KEY=your_firecrawl_key

# Gemini
GEMINI_API_KEY=your_gemini_key
```

## Database Setup

Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor.

## Build & Run Locally

```bash
npm install
npm run build
npm run start
```

The app will be available at http://localhost:3000
