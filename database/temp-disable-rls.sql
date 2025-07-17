-- Temporarily allow anonymous users to insert golf courses
-- Run this in Supabase SQL Editor to allow adding courses without authentication

DROP POLICY IF EXISTS "Authenticated users can insert golf courses" ON golf_courses;

CREATE POLICY "Anyone can insert golf courses" ON golf_courses
  FOR INSERT WITH CHECK (true);

-- Also allow anonymous users to insert rankings
DROP POLICY IF EXISTS "Users can insert own rankings" ON user_golf_course_rankings;

CREATE POLICY "Anyone can insert rankings" ON user_golf_course_rankings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own rankings" ON user_golf_course_rankings;

CREATE POLICY "Anyone can view rankings" ON user_golf_course_rankings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own rankings" ON user_golf_course_rankings;

CREATE POLICY "Anyone can update rankings" ON user_golf_course_rankings
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete own rankings" ON user_golf_course_rankings;

CREATE POLICY "Anyone can delete rankings" ON user_golf_course_rankings
  FOR DELETE USING (true);