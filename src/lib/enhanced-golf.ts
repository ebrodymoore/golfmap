// Simplified golf functions for deployment

/* eslint-disable @typescript-eslint/no-unused-vars */

export interface RankedGolfCourse {
  id: string
  name: string
  location: string
  country: string
  latitude?: number
  longitude?: number
  description?: string
  rank: number
  notes?: string
  date_played?: string
  created_at: string
  updated_at: string
}

interface CreateGolfCourseInput {
  name: string
  location: string
  country: string
  latitude?: number
  longitude?: number
  description?: string
}

interface CreateRankingInput {
  golf_course_id: string
  rank: number
  notes?: string
  date_played?: string
}

interface UpdateRankingInput {
  rank?: number
  notes?: string
  date_played?: string
}

// Mock functions that return empty data for now
export async function getGolfCourses(): Promise<RankedGolfCourse[]> {
  return []
}

export async function getUserRankings(userId: string): Promise<RankedGolfCourse[]> {
  return []
}

export async function createGolfCourse(input: CreateGolfCourseInput): Promise<RankedGolfCourse> {
  throw new Error('Database not configured. Please add your Supabase credentials.')
}

export async function createRanking(userId: string, input: CreateRankingInput): Promise<void> {
  throw new Error('Database not configured. Please add your Supabase credentials.')
}

export async function updateRanking(rankingId: string, input: UpdateRankingInput): Promise<void> {
  throw new Error('Database not configured. Please add your Supabase credentials.')
}

export async function deleteRanking(rankingId: string): Promise<void> {
  throw new Error('Database not configured. Please add your Supabase credentials.')
}

export async function reorderRankings(userId: string, rankings: { id: string; rank: number }[]): Promise<void> {
  throw new Error('Database not configured. Please add your Supabase credentials.')
}