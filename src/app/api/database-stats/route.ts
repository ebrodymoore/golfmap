import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get total courses count
    const { count: totalCourses } = await supabase
      .from('golf_courses')
      .select('*', { count: 'exact', head: true })

    // Get courses by country
    const { data: coursesByCountry } = await supabase
      .from('golf_courses')
      .select('country')
      .then(({ data }) => {
        const counts = data?.reduce((acc, course) => {
          acc[course.country] = (acc[course.country] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        return { data: counts }
      })

    // Get courses by type
    const { data: coursesByType } = await supabase
      .from('golf_courses')
      .select('course_type')
      .then(({ data }) => {
        const counts = data?.reduce((acc, course) => {
          const type = course.course_type || 'unknown'
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        return { data: counts }
      })

    // Get courses with coordinates
    const { count: coursesWithCoordinates } = await supabase
      .from('golf_courses')
      .select('*', { count: 'exact', head: true })
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)

    // Get courses by data source
    const { data: coursesBySource } = await supabase
      .from('golf_courses')
      .select('data_source')
      .then(({ data }) => {
        const counts = data?.reduce((acc, course) => {
          const source = course.data_source || 'unknown'
          acc[source] = (acc[source] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        return { data: counts }
      })

    // Get average ratings
    const { data: ratingStats } = await supabase
      .from('golf_courses')
      .select('google_rating, google_reviews_count')
      .not('google_rating', 'is', null)
      .then(({ data }) => {
        if (!data || data.length === 0) return { data: null }
        
        const avgRating = data.reduce((sum, course) => sum + course.google_rating, 0) / data.length
        const avgReviews = data.reduce((sum, course) => sum + (course.google_reviews_count || 0), 0) / data.length
        
        return {
          data: {
            avgRating: Math.round(avgRating * 100) / 100,
            avgReviews: Math.round(avgReviews),
            totalRated: data.length
          }
        }
      })

    // Get recent additions
    const { data: recentCourses } = await supabase
      .from('golf_courses')
      .select('name, country, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      success: true,
      stats: {
        totalCourses,
        coursesWithCoordinates,
        coursesByCountry,
        coursesByType,
        coursesBySource,
        ratingStats,
        recentCourses
      }
    })

  } catch (error) {
    console.error('Error fetching database stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch database statistics' },
      { status: 500 }
    )
  }
}