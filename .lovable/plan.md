

# Add User Authentication to ScholarScout

## Overview
Add email/password login and signup so users can persist their resume data and match history across sessions. Currently everything is stored in React state and lost on refresh.

## What You'll Get
- A polished login/signup page matching the existing dark navy + emerald theme
- Automatic profile creation when you sign up
- Your resume data saved to the cloud after processing
- Match history saved every time you run Smart Match
- A user menu in the sidebar with sign-out

---

## Technical Plan

### 1. Database Tables (Migration)

**profiles** -- stores resume data per user
- `user_id` (uuid, PK, references auth.users ON DELETE CASCADE)
- `name` (text)
- `skills` (jsonb, default '[]')
- `projects` (jsonb, default '[]')
- `raw_text` (text)
- `created_at`, `updated_at` (timestamptz)

**match_history** -- stores Smart Match results
- `id` (uuid, PK, auto-generated)
- `user_id` (uuid, NOT NULL, references profiles)
- `opportunity_id` (text)
- `opportunity_title` (text)
- `score` (integer)
- `highlights` (jsonb)
- `skill_gap` (text)
- `created_at` (timestamptz)

Enable RLS on both tables. Policies: users can only SELECT/INSERT/UPDATE/DELETE their own rows (`auth.uid() = user_id`).

Auto-create a profile row on signup via a database trigger on `auth.users`.

### 2. Auth Context (`src/hooks/useAuth.tsx`)
- React context wrapping `supabase.auth.onAuthStateChange` and `getSession`
- Exposes `user`, `session`, `signUp`, `signIn`, `signOut`, `loading`
- Wrap the app in this provider in `App.tsx`

### 3. Auth Page (`src/pages/Auth.tsx`)
- Combined login/signup form with tab toggle
- Styled with the glassmorphism theme
- Email + password fields
- Shows a message after signup to check email for verification
- Route: `/auth`

### 4. Protected Routes
- Create a `ProtectedRoute` wrapper that redirects to `/auth` if not logged in
- Wrap the Index route with it

### 5. Update Existing Components

**AppSidebar** -- add user avatar/email display at bottom with sign-out button

**ResumeUpload** -- after resume is processed, save/update the `profiles` row with name, skills, projects, raw_text

**Index page** -- on mount, load saved resume data from `profiles` table into state (so returning users see their data)

**AICommandCenter** -- after Smart Match runs, insert a row into `match_history`; optionally add a "Match History" view in the sidebar

### 6. Routing Updates (`App.tsx`)
- Add `/auth` route
- Wrap `/` in `ProtectedRoute`

### 7. File Changes Summary

| File | Action |
|------|--------|
| Migration SQL | Create profiles, match_history, trigger, RLS |
| `src/hooks/useAuth.tsx` | New -- auth context provider |
| `src/pages/Auth.tsx` | New -- login/signup page |
| `src/components/ProtectedRoute.tsx` | New -- auth guard |
| `src/App.tsx` | Add AuthProvider, new routes |
| `src/components/AppSidebar.tsx` | Add user info + sign out |
| `src/components/ResumeUpload.tsx` | Save resume to profiles table |
| `src/pages/Index.tsx` | Load profile on mount |
| `src/components/AICommandCenter.tsx` | Save match results to match_history |

