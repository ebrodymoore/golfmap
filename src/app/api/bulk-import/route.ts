import { NextResponse } from 'next/server'
import { bulkImportByRegion, bulkImportTopCourses } from '@/scripts/bulk-import'

export async function POST(request: Request) {
  try {
    const { type } = await request.json()
    
    if (type === 'regions') {
      await bulkImportByRegion()
      return NextResponse.json({ message: 'Regional courses imported successfully' })
    } else if (type === 'top-courses') {
      await bulkImportTopCourses()
      return NextResponse.json({ message: 'Top courses imported successfully' })
    } else {
      return NextResponse.json(
        { error: 'Invalid import type. Use "regions" or "top-courses"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error in bulk import:', error)
    return NextResponse.json(
      { error: 'Failed to bulk import courses' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST with {"type": "regions"} or {"type": "top-courses"} to bulk import courses' 
  })
}