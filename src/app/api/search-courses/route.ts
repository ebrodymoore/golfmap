import { NextRequest, NextResponse } from 'next/server'
import { searchCoursesWithGoogle } from '@/lib/course-data'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  const location = searchParams.get('location')

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    )
  }

  try {
    const courses = await searchCoursesWithGoogle(query, location || undefined)
    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Error searching courses:', error)
    return NextResponse.json(
      { error: 'Failed to search courses' },
      { status: 500 }
    )
  }
}