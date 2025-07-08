-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Golf courses table
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

-- User golf course rankings table
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

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for golf courses
CREATE POLICY "Golf courses are viewable by everyone" ON golf_courses
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert golf courses" ON golf_courses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for user rankings
CREATE POLICY "Users can view own rankings" ON user_golf_course_rankings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rankings" ON user_golf_course_rankings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rankings" ON user_golf_course_rankings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rankings" ON user_golf_course_rankings
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_rankings_user_id ON user_golf_course_rankings(user_id);
CREATE INDEX idx_user_rankings_rank ON user_golf_course_rankings(user_id, rank);
CREATE INDEX idx_golf_courses_location ON golf_courses(country, location);