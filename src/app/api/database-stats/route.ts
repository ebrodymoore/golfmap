import { NextResponse } from 'next/server'

// Temporarily disable database stats for deployment
export async function GET() {
  return NextResponse.json({
    success: true,
    stats: {
      totalCourses: 0,
      coursesWithCoordinates: 0,
      coursesByCountry: {},
      coursesByType: {},
      coursesBySource: {},
      ratingStats: null,
      recentCourses: []
    }
  })
}