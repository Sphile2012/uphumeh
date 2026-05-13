# Phume - Instagram Clone Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Supabase CLI
- Git

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd phume-instagram-clone
npm install
```

### 2. Supabase Setup

#### Option A: Use Supabase Cloud (Recommended for production)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the migrations in your Supabase dashboard:
   - Go to SQL Editor
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Run the migration
   - Copy and paste the contents of `supabase/migrations/002_functions.sql`
   - Run the functions

#### Option B: Use Local Supabase (For development)

1. Install Supabase CLI:
```bash
npm install -g @supabase/cli
```

2. Start local Supabase:
```bash
supabase start
```

3. The CLI will output your local credentials. Create `.env.local`:
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_local_anon_key
```

### 3. Database Setup

The migrations will automatically create:
- User profiles table
- Posts table with media support
- Stories with 24-hour expiration
- Comments and replies system
- Likes and follows system
- Real-time messaging
- Story views tracking

### 4. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Features Included

### Authentication
- Email/password signup and login
- User profiles with avatars
- Protected routes

### Core Features
- Photo/video posting
- Stories (24-hour expiration)
- Real-time messaging
- Like and comment system
- Follow/unfollow users
- Explore feed
- User search

### Backend Features
- PostgreSQL database with Supabase
- Real-time subscriptions
- File storage for media
- Row Level Security (RLS)
- Automatic counter updates
- Search functionality

## Environment Variables

Create a `.env.local` file with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For development
VITE_ENABLE_ROUTE_MESSAGING=true
```

## Database Schema

The database includes these main tables:
- `profiles` - User information
- `posts` - User posts with media
- `stories` - Temporary stories
- `comments` - Post comments and replies
- `likes` - Post likes
- `follows` - User relationships
- `messages` - Direct messages
- `story_views` - Story view tracking

## API Structure

All API functions are organized in `src/api/`:
- `auth.ts` - Authentication functions
- `posts.ts` - Post management
- `stories.ts` - Story management
- `messages.ts` - Messaging system
- `follows.ts` - Follow system
- `comments.ts` - Comment system

## Deployment

### Vercel Deployment

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Netlify Deployment

1. Connect your GitHub repo to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy

## Troubleshooting

### Common Issues

1. **Supabase connection errors**: Check your environment variables
2. **Authentication issues**: Verify your Supabase project settings
3. **Database errors**: Ensure migrations have been run
4. **File upload issues**: Check Supabase storage settings

### Development Tips

1. Use Supabase Studio for database management
2. Check browser console for detailed error messages
3. Use React Query DevTools for API debugging
4. Monitor Supabase logs for backend issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

*Built by Phumeh - Instagram Clone with modern web technologies*