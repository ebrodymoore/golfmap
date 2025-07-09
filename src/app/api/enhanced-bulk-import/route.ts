import { NextRequest, NextResponse } from 'next/server'

// Temporarily disable enhanced bulk import for deployment
export async function POST() {
  return NextResponse.json({
    error: 'Enhanced bulk import feature is currently disabled. Please use manual course entry.'
  }, { status: 503 })
}

export async function GET() {
  return NextResponse.json({
    message: 'Enhanced bulk import feature is currently disabled'
  })
}