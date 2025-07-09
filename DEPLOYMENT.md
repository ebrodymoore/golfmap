# GolfMap Deployment Guide

## 🚀 Quick Deployment Steps

### 1. **Supabase Setup**
```bash
# 1. Create account at supabase.com
# 2. Create new project
# 3. Go to SQL Editor and run the basic schema first:
```

```sql
-- Run this FIRST in Supabase SQL Editor (basic schema)
-- Copy from database/schema.sql (the original basic version)

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Golf courses table (basic version)
CREATE TABLE golf_courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User golf course rankings table (basic version)
CREATE TABLE user_golf_course_rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  golf_course_id UUID REFERENCES golf_courses(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  notes TEXT,
  date_played DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, golf_course_id),
  UNIQUE(user_id, rank)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE golf_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_golf_course_rankings ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Golf courses are viewable by everyone" ON golf_courses
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert golf courses" ON golf_courses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view own rankings" ON user_golf_course_rankings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rankings" ON user_golf_course_rankings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rankings" ON user_golf_course_rankings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rankings" ON user_golf_course_rankings
  FOR DELETE USING (auth.uid() = user_id);

-- Basic indexes
CREATE INDEX idx_user_rankings_user_id ON user_golf_course_rankings(user_id);
CREATE INDEX idx_user_rankings_rank ON user_golf_course_rankings(user_id, rank);
CREATE INDEX idx_golf_courses_location ON golf_courses(country, location);
```

### 2. **Environment Variables**
```bash
# Update .env.local with your actual credentials:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

### 3. **Google Maps API Setup** (Optional - for advanced features)
```bash
# 1. Go to Google Cloud Console
# 2. Create new project or select existing
# 3. Enable "Places API" and "Maps JavaScript API"
# 4. Create API key in "Credentials"
# 5. Add key to .env.local
```

### 4. **Deploy to Vercel**
```bash
# Option 1: Vercel CLI
npm install -g vercel
vercel

# Option 2: GitHub integration
# 1. Push to GitHub
# 2. Import project in Vercel dashboard
# 3. Add environment variables in Vercel settings
```

## 📋 **Post-Deployment Steps**

### 1. **Test Basic Functionality**
- Visit your deployed app
- Try adding a course manually
- Test the course list and map (if coordinates added)

### 2. **Optional: Enhanced Database Migration**
If you want the advanced features (bulk import, enhanced schema):
```sql
-- Run database/migration-safe.sql in Supabase SQL Editor
-- This adds enhanced columns without breaking existing data
```

### 3. **Optional: Populate Sample Data**
- Use the Admin Panel to add famous courses
- Test the bulk import functionality
- Add your own courses

## 🛠️ **Troubleshooting**

### **Common Issues:**

#### **1. Supabase Connection Error**
```bash
# Check .env.local values
# Verify Supabase project URL and anon key
# Ensure RLS policies are set correctly
```

#### **2. Google Maps Not Loading**
```bash
# Verify GOOGLE_MAPS_API_KEY in .env.local
# Check Google Cloud Console billing
# Ensure Places API is enabled
```

#### **3. Build Errors**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

#### **4. Database Schema Issues**
```bash
# Run the basic schema first (see step 1)
# Then optionally run migration-safe.sql
# Never run enhanced-schema.sql on existing data
```

## 🔧 **Development vs Production**

### **Development** (Local)
```bash
# Basic setup with manual course entry
# No Google Maps API required
# Uses basic database schema
```

### **Production** (Full Features)
```bash
# Enhanced database schema
# Google Maps API integration
# Bulk import capabilities
# Advanced search and filtering
```

## 🌟 **Feature Toggles**

The app automatically falls back to basic functionality if advanced features aren't available:

- **No Google Maps API**: Manual coordinate entry only
- **Basic Schema**: Limited course data, basic functionality
- **Enhanced Schema**: Full features, advanced search, bulk import

## 📊 **Performance Notes**

- **Database**: Optimized for up to 10,000+ courses
- **API Costs**: Google Maps API usage depends on import volume
- **Storage**: Minimal storage requirements for course data
- **Speed**: Fast loading with proper indexing

## 🔐 **Security**

- **RLS Policies**: Users can only see/edit their own rankings
- **API Security**: Google Maps API key should be restricted
- **Environment Variables**: Never commit .env.local to git

## 📈 **Scaling**

The app is designed to handle:
- **Users**: Thousands of concurrent users
- **Courses**: 10,000+ golf courses in database
- **Rankings**: Millions of course rankings
- **Search**: Fast full-text search with proper indexing