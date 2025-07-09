-- Enhanced golf courses table with comprehensive data
DROP TABLE IF EXISTS golf_courses CASCADE;

CREATE TABLE golf_courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  state_province VARCHAR(100),
  country VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  
  -- Geographic Data
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Course Details
  description TEXT,
  course_type VARCHAR(50), -- 'public', 'private', 'resort', 'municipal'
  holes INTEGER DEFAULT 18,
  par INTEGER,
  yardage INTEGER,
  rating DECIMAL(3, 1), -- Course rating
  slope_rating INTEGER, -- Slope rating
  
  -- Contact Information
  phone VARCHAR(50),
  website VARCHAR(255),
  email VARCHAR(255),
  
  -- Pricing
  green_fee_range VARCHAR(50), -- e.g., '$50-100', '$100-200'
  cart_fee_range VARCHAR(50),
  
  -- Facilities
  driving_range BOOLEAN DEFAULT false,
  putting_green BOOLEAN DEFAULT false,
  pro_shop BOOLEAN DEFAULT false,
  restaurant BOOLEAN DEFAULT false,
  lodging BOOLEAN DEFAULT false,
  
  -- Ratings and Reviews
  google_rating DECIMAL(2, 1),
  google_reviews_count INTEGER,
  
  -- Course Architecture
  architect VARCHAR(255),
  year_built INTEGER,
  year_renovated INTEGER,
  
  -- Tournament Information
  hosts_tournaments BOOLEAN DEFAULT false,
  tournament_history TEXT,
  
  -- Status and Metadata
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'closed', 'seasonal'
  data_source VARCHAR(50), -- 'google', 'manual', 'usga', 'golf_digest'
  external_id VARCHAR(255), -- ID from external source
  verified BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT unique_course_location UNIQUE(name, city, state_province, country),
  CONSTRAINT valid_rating CHECK (google_rating >= 0 AND google_rating <= 5),
  CONSTRAINT valid_holes CHECK (holes > 0 AND holes <= 72),
  CONSTRAINT valid_par CHECK (par > 0 AND par <= 200)
);

-- Create indexes for performance
CREATE INDEX idx_golf_courses_location ON golf_courses(country, state_province, city);
CREATE INDEX idx_golf_courses_coordinates ON golf_courses(latitude, longitude);
CREATE INDEX idx_golf_courses_name ON golf_courses(name);
CREATE INDEX idx_golf_courses_rating ON golf_courses(google_rating DESC);
CREATE INDEX idx_golf_courses_course_type ON golf_courses(course_type);
CREATE INDEX idx_golf_courses_data_source ON golf_courses(data_source);
CREATE INDEX idx_golf_courses_status ON golf_courses(status);

-- Full text search index
CREATE INDEX idx_golf_courses_search ON golf_courses USING GIN(
  to_tsvector('english', name || ' ' || COALESCE(location, '') || ' ' || COALESCE(description, ''))
);

-- Update the user rankings table to reference the new courses table
DROP TABLE IF EXISTS user_golf_course_rankings CASCADE;

CREATE TABLE user_golf_course_rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  golf_course_id UUID REFERENCES golf_courses(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  notes TEXT,
  date_played DATE,
  personal_rating INTEGER CHECK (personal_rating >= 1 AND personal_rating <= 10),
  would_play_again BOOLEAN,
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 10),
  condition_rating INTEGER CHECK (condition_rating >= 1 AND condition_rating <= 10),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 10),
  favorite_hole INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, golf_course_id),
  UNIQUE(user_id, rank)
);

-- Create indexes for user rankings
CREATE INDEX idx_user_rankings_user_id ON user_golf_course_rankings(user_id);
CREATE INDEX idx_user_rankings_course_id ON user_golf_course_rankings(golf_course_id);
CREATE INDEX idx_user_rankings_rank ON user_golf_course_rankings(user_id, rank);
CREATE INDEX idx_user_rankings_rating ON user_golf_course_rankings(personal_rating DESC);

-- Enable Row Level Security
ALTER TABLE golf_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_golf_course_rankings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for golf courses
CREATE POLICY "Golf courses are viewable by everyone" ON golf_courses
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert golf courses" ON golf_courses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update golf courses" ON golf_courses
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for user rankings
CREATE POLICY "Users can view own rankings" ON user_golf_course_rankings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rankings" ON user_golf_course_rankings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rankings" ON user_golf_course_rankings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rankings" ON user_golf_course_rankings
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update timestamps
CREATE TRIGGER update_golf_courses_updated_at 
    BEFORE UPDATE ON golf_courses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_rankings_updated_at 
    BEFORE UPDATE ON user_golf_course_rankings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for course statistics
CREATE VIEW course_statistics AS
SELECT 
  gc.id,
  gc.name,
  gc.location,
  gc.country,
  gc.google_rating,
  gc.google_reviews_count,
  COUNT(ugcr.id) as total_user_rankings,
  AVG(ugcr.personal_rating) as avg_personal_rating,
  AVG(ugcr.difficulty_rating) as avg_difficulty_rating,
  AVG(ugcr.condition_rating) as avg_condition_rating,
  AVG(ugcr.value_rating) as avg_value_rating
FROM golf_courses gc
LEFT JOIN user_golf_course_rankings ugcr ON gc.id = ugcr.golf_course_id
GROUP BY gc.id, gc.name, gc.location, gc.country, gc.google_rating, gc.google_reviews_count;