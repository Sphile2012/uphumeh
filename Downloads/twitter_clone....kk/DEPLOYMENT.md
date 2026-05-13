# Twitter Clone Deployment Guide

**Cloned by Phumeh**

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Netlify account
- Git repository

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Go to Settings > API to get your project URL and anon key
4. Enable Email Auth in Authentication > Settings

### 2. Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Netlify Deployment

#### Option A: Git Integration (Recommended)
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

#### Option B: Manual Deploy
```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### 5. Post-Deployment

1. Update Supabase Auth settings:
   - Add your Netlify domain to allowed origins
   - Set redirect URLs for auth
2. Test all features:
   - User registration/login
   - Tweet posting
   - Real-time updates
   - Responsive design

## Features Included

- ✅ User authentication (Supabase Auth)
- ✅ Tweet CRUD operations
- ✅ Like/Unlike functionality
- ✅ Follow/Unfollow system
- ✅ Real-time updates
- ✅ Direct messaging
- ✅ Responsive design
- ✅ Dark/Light mode
- ✅ Netlify deployment ready

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State**: TanStack Query, Zustand
- **Deployment**: Netlify

## Support

For issues or questions, check the repository documentation or create an issue.

---
**Twitter Clone - Cloned by Phumeh**