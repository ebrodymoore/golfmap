export interface EnhancedGolfCourse {
  id: string
  
  // Basic Information
  name: string
  location: string
  city?: string
  state_province?: string
  country: string
  postal_code?: string
  
  // Geographic Data
  latitude?: number
  longitude?: number
  
  // Course Details
  description?: string
  course_type?: 'public' | 'private' | 'resort' | 'municipal'
  holes?: number
  par?: number
  yardage?: number
  rating?: number // Course rating
  slope_rating?: number // Slope rating
  
  // Contact Information
  phone?: string
  website?: string
  email?: string
  
  // Pricing
  green_fee_range?: string
  cart_fee_range?: string
  
  // Facilities
  driving_range?: boolean
  putting_green?: boolean
  pro_shop?: boolean
  restaurant?: boolean
  lodging?: boolean
  
  // Ratings and Reviews
  google_rating?: number
  google_reviews_count?: number
  
  // Course Architecture
  architect?: string
  year_built?: number
  year_renovated?: number
  
  // Tournament Information
  hosts_tournaments?: boolean
  tournament_history?: string
  
  // Status and Metadata
  status?: 'active' | 'closed' | 'seasonal'
  data_source?: 'google' | 'manual' | 'usga' | 'golf_digest'
  external_id?: string
  verified?: boolean
  
  // Timestamps
  created_at: string
  updated_at: string
  last_verified_at?: string
}

export interface EnhancedUserGolfCourseRanking {
  id: string
  user_id: string
  golf_course_id: string
  rank: number
  notes?: string
  date_played?: string
  personal_rating?: number // 1-10
  would_play_again?: boolean
  difficulty_rating?: number // 1-10
  condition_rating?: number // 1-10
  value_rating?: number // 1-10
  favorite_hole?: number
  created_at: string
  updated_at: string
  golf_course?: EnhancedGolfCourse
}

export interface EnhancedRankedGolfCourse extends EnhancedGolfCourse {
  rank: number
  notes?: string
  date_played?: string
  personal_rating?: number
  would_play_again?: boolean
  difficulty_rating?: number
  condition_rating?: number
  value_rating?: number
  favorite_hole?: number
}

export interface CourseStatistics {
  id: string
  name: string
  location: string
  country: string
  google_rating?: number
  google_reviews_count?: number
  total_user_rankings: number
  avg_personal_rating?: number
  avg_difficulty_rating?: number
  avg_condition_rating?: number
  avg_value_rating?: number
}

export interface BulkImportResult {
  success: number
  failed: number
  duplicates: number
  errors: string[]
}

export interface CourseFilter {
  country?: string
  state_province?: string
  course_type?: string
  min_rating?: number
  max_rating?: number
  has_coordinates?: boolean
  verified_only?: boolean
}

export interface CreateEnhancedGolfCourseInput {
  name: string
  location: string
  city?: string
  state_province?: string
  country: string
  postal_code?: string
  latitude?: number
  longitude?: number
  description?: string
  course_type?: 'public' | 'private' | 'resort' | 'municipal'
  holes?: number
  par?: number
  yardage?: number
  rating?: number
  slope_rating?: number
  phone?: string
  website?: string
  email?: string
  green_fee_range?: string
  cart_fee_range?: string
  driving_range?: boolean
  putting_green?: boolean
  pro_shop?: boolean
  restaurant?: boolean
  lodging?: boolean
  google_rating?: number
  google_reviews_count?: number
  architect?: string
  year_built?: number
  year_renovated?: number
  hosts_tournaments?: boolean
  tournament_history?: string
  data_source?: 'google' | 'manual' | 'usga' | 'golf_digest'
  external_id?: string
}