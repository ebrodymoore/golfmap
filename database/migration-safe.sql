-- Safe migration script that works with existing data
-- This adds new columns to existing tables without breaking functionality

-- Add new columns to golf_courses table if they don't exist
DO $$ 
BEGIN
    -- Add new columns one by one with IF NOT EXISTS checks
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='city') THEN
        ALTER TABLE golf_courses ADD COLUMN city VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='state_province') THEN
        ALTER TABLE golf_courses ADD COLUMN state_province VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='postal_code') THEN
        ALTER TABLE golf_courses ADD COLUMN postal_code VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='course_type') THEN
        ALTER TABLE golf_courses ADD COLUMN course_type VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='holes') THEN
        ALTER TABLE golf_courses ADD COLUMN holes INTEGER DEFAULT 18;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='par') THEN
        ALTER TABLE golf_courses ADD COLUMN par INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='yardage') THEN
        ALTER TABLE golf_courses ADD COLUMN yardage INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='rating') THEN
        ALTER TABLE golf_courses ADD COLUMN rating DECIMAL(3, 1);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='slope_rating') THEN
        ALTER TABLE golf_courses ADD COLUMN slope_rating INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='phone') THEN
        ALTER TABLE golf_courses ADD COLUMN phone VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='website') THEN
        ALTER TABLE golf_courses ADD COLUMN website VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='email') THEN
        ALTER TABLE golf_courses ADD COLUMN email VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='green_fee_range') THEN
        ALTER TABLE golf_courses ADD COLUMN green_fee_range VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='cart_fee_range') THEN
        ALTER TABLE golf_courses ADD COLUMN cart_fee_range VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='driving_range') THEN
        ALTER TABLE golf_courses ADD COLUMN driving_range BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='putting_green') THEN
        ALTER TABLE golf_courses ADD COLUMN putting_green BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='pro_shop') THEN
        ALTER TABLE golf_courses ADD COLUMN pro_shop BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='restaurant') THEN
        ALTER TABLE golf_courses ADD COLUMN restaurant BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='lodging') THEN
        ALTER TABLE golf_courses ADD COLUMN lodging BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='google_rating') THEN
        ALTER TABLE golf_courses ADD COLUMN google_rating DECIMAL(2, 1);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='google_reviews_count') THEN
        ALTER TABLE golf_courses ADD COLUMN google_reviews_count INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='architect') THEN
        ALTER TABLE golf_courses ADD COLUMN architect VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='year_built') THEN
        ALTER TABLE golf_courses ADD COLUMN year_built INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='year_renovated') THEN
        ALTER TABLE golf_courses ADD COLUMN year_renovated INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='hosts_tournaments') THEN
        ALTER TABLE golf_courses ADD COLUMN hosts_tournaments BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='tournament_history') THEN
        ALTER TABLE golf_courses ADD COLUMN tournament_history TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='status') THEN
        ALTER TABLE golf_courses ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='data_source') THEN
        ALTER TABLE golf_courses ADD COLUMN data_source VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='external_id') THEN
        ALTER TABLE golf_courses ADD COLUMN external_id VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='verified') THEN
        ALTER TABLE golf_courses ADD COLUMN verified BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='golf_courses' AND column_name='last_verified_at') THEN
        ALTER TABLE golf_courses ADD COLUMN last_verified_at TIMESTAMP WITH TIME ZONE;
    END IF;
END
$$;

-- Add new columns to user_golf_course_rankings table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_golf_course_rankings' AND column_name='personal_rating') THEN
        ALTER TABLE user_golf_course_rankings ADD COLUMN personal_rating INTEGER CHECK (personal_rating >= 1 AND personal_rating <= 10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_golf_course_rankings' AND column_name='would_play_again') THEN
        ALTER TABLE user_golf_course_rankings ADD COLUMN would_play_again BOOLEAN;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_golf_course_rankings' AND column_name='difficulty_rating') THEN
        ALTER TABLE user_golf_course_rankings ADD COLUMN difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_golf_course_rankings' AND column_name='condition_rating') THEN
        ALTER TABLE user_golf_course_rankings ADD COLUMN condition_rating INTEGER CHECK (condition_rating >= 1 AND condition_rating <= 10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_golf_course_rankings' AND column_name='value_rating') THEN
        ALTER TABLE user_golf_course_rankings ADD COLUMN value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_golf_course_rankings' AND column_name='favorite_hole') THEN
        ALTER TABLE user_golf_course_rankings ADD COLUMN favorite_hole INTEGER;
    END IF;
END
$$;

-- Create indexes if they don't exist
DO $$
BEGIN
    -- Check if index exists before creating
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_golf_courses_location_enhanced') THEN
        CREATE INDEX idx_golf_courses_location_enhanced ON golf_courses(country, state_province, city);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_golf_courses_coordinates_enhanced') THEN
        CREATE INDEX idx_golf_courses_coordinates_enhanced ON golf_courses(latitude, longitude);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_golf_courses_course_type') THEN
        CREATE INDEX idx_golf_courses_course_type ON golf_courses(course_type);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_golf_courses_data_source') THEN
        CREATE INDEX idx_golf_courses_data_source ON golf_courses(data_source);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_golf_courses_status') THEN
        CREATE INDEX idx_golf_courses_status ON golf_courses(status);
    END IF;
END
$$;

-- Create update trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_golf_courses_updated_at') THEN
        CREATE TRIGGER update_golf_courses_updated_at 
            BEFORE UPDATE ON golf_courses 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_rankings_updated_at') THEN
        CREATE TRIGGER update_user_rankings_updated_at 
            BEFORE UPDATE ON user_golf_course_rankings 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;