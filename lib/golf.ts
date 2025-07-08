import { supabase } from './supabase'
import { 
  GolfCourse, 
  UserGolfCourseRanking, 
  RankedGolfCourse, 
  CreateGolfCourseInput, 
  CreateRankingInput, 
  UpdateRankingInput 
} from '@/types/golf'

export async function getGolfCourses(): Promise<GolfCourse[]> {
  const { data, error } = await supabase
    .from('golf_courses')
    .select('*')
    .order('name')

  if (error) throw error
  return data || []
}

export async function createGolfCourse(input: CreateGolfCourseInput): Promise<GolfCourse> {
  const { data, error } = await supabase
    .from('golf_courses')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserRankings(userId: string): Promise<RankedGolfCourse[]> {
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
    date_played: ranking.date_played
  }))
}

export async function createRanking(userId: string, input: CreateRankingInput): Promise<UserGolfCourseRanking> {
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

export async function updateRanking(rankingId: string, input: UpdateRankingInput): Promise<UserGolfCourseRanking> {
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