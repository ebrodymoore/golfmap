/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { supabase } from './supabase'
import { 
  EnhancedGolfCourse, 
  EnhancedRankedGolfCourse, 
  CreateEnhancedGolfCourseInput
} from '../types/enhanced-golf'

// Backwards compatible functions that work with both old and new schema
export async function getEnhancedGolfCourses(): Promise<EnhancedGolfCourse[]> {
  const { data, error } = await supabase
    .from('golf_courses')
    .select('*')
    .order('name')

  if (error) throw error
  return data || []
}

export async function createEnhancedGolfCourse(input: CreateEnhancedGolfCourseInput): Promise<EnhancedGolfCourse> {
  const { data, error } = await supabase
    .from('golf_courses')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getEnhancedUserRankings(userId: string): Promise<EnhancedRankedGolfCourse[]> {
  const { data, error } = await supabase
    .from('user_golf_course_rankings')
    .select(`
      *,
      golf_course:golf_courses(*)
    `)
    .eq('user_id', userId)
    .order('rank')

  if (error) throw error
  
  return (data || []).map(ranking => ({
    ...ranking.golf_course,
    rank: ranking.rank,
    notes: ranking.notes,
    date_played: ranking.date_played,
    personal_rating: ranking.personal_rating,
    would_play_again: ranking.would_play_again,
    difficulty_rating: ranking.difficulty_rating,
    condition_rating: ranking.condition_rating,
    value_rating: ranking.value_rating,
    favorite_hole: ranking.favorite_hole
  }))
}

// Backwards compatible wrapper functions
export async function getGolfCourses() {
  return getEnhancedGolfCourses()
}

export async function getUserRankings(userId: string) {
  try {
    return await getEnhancedUserRankings(userId)
  } catch (error) {
    // Fallback to original schema if enhanced fails
    console.warn('Enhanced schema not available, using original schema')
    
    const { data, error: fallbackError } = await supabase
      .from('user_golf_course_rankings')
      .select(`
        *,
        golf_course:golf_courses(*)
      `)
      .eq('user_id', userId)
      .order('rank')

    if (fallbackError) throw fallbackError
    
    return (data || []).map(ranking => ({
      ...ranking.golf_course,
      rank: ranking.rank,
      notes: ranking.notes,
      date_played: ranking.date_played
    }))
  }
}

export async function createGolfCourse(input: any) {
  try {
    return await createEnhancedGolfCourse(input)
  } catch (error) {
    // Fallback to original schema
    console.warn('Enhanced schema not available, using original schema')
    
    const { data, error: fallbackError } = await supabase
      .from('golf_courses')
      .insert({
        name: input.name,
        location: input.location,
        country: input.country,
        latitude: input.latitude,
        longitude: input.longitude,
        description: input.description
      })
      .select()
      .single()

    if (fallbackError) throw fallbackError
    return data
  }
}

export async function createRanking(userId: string, input: any) {
  const { data, error } = await supabase
    .from('user_golf_course_rankings')
    .insert({
      user_id: userId,
      ...input
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRanking(rankingId: string, input: any) {
  const { data, error } = await supabase
    .from('user_golf_course_rankings')
    .update(input)
    .eq('id', rankingId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRanking(rankingId: string): Promise<void> {
  const { error } = await supabase
    .from('user_golf_course_rankings')
    .delete()
    .eq('id', rankingId)

  if (error) throw error
}

export async function reorderRankings(userId: string, rankings: { id: string; rank: number }[]): Promise<void> {
  const updates = rankings.map(({ id, rank }) => ({
    id,
    rank,
    user_id: userId
  }))

  const { error } = await supabase
    .from('user_golf_course_rankings')
    .upsert(updates, { onConflict: 'id' })

  if (error) throw error
}