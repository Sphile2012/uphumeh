# Twitter Clone - Quick Start Guide

**Cloned by Phumeh**

## 🚀 What You Have

A fully functional Twitter clone with:
- ✅ User authentication
- ✅ Tweet posting & interactions
- ✅ Follow system
- ✅ Direct messaging
- ✅ Responsive design
- ✅ Ready for deployment

## 📦 Current Status

The app is **built and ready** but needs Supabase configuration to work.

When you open the app now, you'll see a setup screen with instructions.

## ⚡ Quick Setup (5 minutes)

### 1. Create Supabase Project
```bash
# Go to https://supabase.com
# Click "New Project"
# Choose a name and password
# Wait for project to be ready (~2 minutes)
```

### 2. Set Up Database
```bash
# In Supabase dashboard:
# 1. Go to SQL Editor
# 2. Click "New Query"
# 3. Copy contents from supabase/schema.sql
# 4. Paste and click "Run"
```

### 3. Get Your Credentials
```bash
# In Supabase dashboard:
# 1. Go to Settings → API
# 2. Copy "Project URL"
# 3. Copy "anon public" key
```

### 4. Configure Environment
Create `.env` file in project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Rebuild & Run
```bash
npm run build
npm run preview
# Visit http://localhost:4173
```

## 🌐 Deploy to Netlify

### Option A: Git Deploy (Recommended)
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit - Twitter clone by Phumeh"
git remote add origin your-repo-url
git push -u origin main

# 2. In Netlify:
# - Connect repository
# - Build command: npm run build
# - Publish directory: dist
# - Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
# - Deploy!
```

### Option B: Manual Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# Follow prompts to create new site
```

## 🎯 Features Overview

### Authentication
- Email/password signup
- Secure login
- Session management
- Profile creation

### Tweets
- Post tweets (280 char limit)
- Like/unlike
- Delete own tweets
- Real-time feed

### Social
- Follow/unfollow users
- View profiles
- Direct messaging
- Notifications (schema ready)

### UI/UX
- Responsive design
- Mobile bottom nav
- Desktop sidebar
- Dark/light mode
- Twitter-like interface

## 📁 Project Structure

```
twitter-clone/
├── src/
│   ├── api/twitter.ts          # Supabase API functions
│   ├── lib/supabase.ts         # Supabase client
│   ├── hooks/
│   │   ├── useAuth.ts          # Authentication hook
│   │   └── useTweets.ts        # Tweet management
│   ├── components/
│   │   ├── AuthModal.tsx       # Login/signup
│   │   ├── AuthGuard.tsx       # Route protection
│   │   └── Layout.tsx          # App layout
│   └── pages/                  # All pages
├── supabase/
│   └── schema.sql              # Database schema
├── .env                        # Your credentials (create this)
├── netlify.toml                # Deployment config
└── DEPLOYMENT.md               # Detailed guide
```

## 🐛 Troubleshooting

### Blank Page
- Check browser console for errors
- Verify `.env` file exists and has correct values
- Rebuild: `npm run build`

### Auth Not Working
- Verify Supabase credentials are correct
- Check Supabase project is active
- Ensure schema was run successfully

### Build Errors
- Clear cache: `rm -rf dist node_modules/.vite`
- Reinstall: `npm install`
- Rebuild: `npm run build`

## 📚 Documentation

- `README.md` - Project overview
- `DEPLOYMENT.md` - Detailed deployment guide
- `SETUP_STATUS.md` - Setup checklist
- `supabase/schema.sql` - Database structure

## 💡 Next Steps

1. ✅ Set up Supabase (5 min)
2. ✅ Test locally (1 min)
3. ✅ Deploy to Netlify (5 min)
4. 🎉 Share your Twitter clone!

## 🆘 Need Help?

Check these files:
- `DEPLOYMENT.md` - Step-by-step deployment
- `SETUP_STATUS.md` - Current status & issues
- Supabase docs: https://supabase.com/docs
- Netlify docs: https://docs.netlify.com

---

**Built with**: React, TypeScript, Supabase, Tailwind CSS, shadcn/ui
**Cloned by**: Phumeh
**Ready for**: Production deployment
