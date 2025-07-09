import { NextResponse } from 'next/server'

// Temporarily disable course population for deployment
export async function POST() {
  return NextResponse.json({
    error: 'Course population feature is currently disabled. Please use manual course entry.'
  }, { status: 503 })
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Course population feature is currently disabled' 
  })
}