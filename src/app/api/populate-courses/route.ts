import { NextResponse } from 'next/server'
import { populateFamousCourses } from '@/lib/course-data'

export async function POST() {
  try {
    await populateFamousCourses()
    return NextResponse.json({ message: 'Famous courses populated successfully' })
  } catch (error) {
    console.error('Error populating courses:', error)
    return NextResponse.json(
      { error: 'Failed to populate courses' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to populate famous courses database' 
  })
}