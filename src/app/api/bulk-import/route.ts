import { NextResponse } from 'next/server'

// Temporarily disable bulk import functionality for deployment
export async function POST() {
  return NextResponse.json({
    error: 'Bulk import feature is currently disabled. Please use manual course entry.'
  }, { status: 503 })
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Bulk import feature is currently disabled' 
  })
}