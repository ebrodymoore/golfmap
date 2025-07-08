export interface GolfCourse {
  id: string
  name: string
  location: string
  country: string
  latitude?: number
  longitude?: number
  description?: string
  created_at: string
  updated_at: string
}

export interface UserGolfCourseRanking {
  id: string
  user_id: string
  golf_course_id: string
  rank: number
  notes?: string
  date_played?: string
  created_at: string
  updated_at: string
  golf_course?: GolfCourse
}

export interface RankedGolfCourse extends GolfCourse {
  rank: number
  notes?: string
  date_played?: string
}

export interface CreateGolfCourseInput {
  name: string
  location: string
  country: string
  latitude?: number
  longitude?: number
  description?: string
}

export interface CreateRankingInput {
  golf_course_id: string
  rank: number
  notes?: string
  date_played?: string
}

export interface UpdateRankingInput {
  rank?: number
  notes?: string
  date_played?: string
}