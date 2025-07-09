import { NextResponse } from 'next/server'

// Temporarily disable Google search for deployment
export async function GET() {
  return NextResponse.json({
    error: 'Google course search is currently disabled. Please use manual course entry.'
  }, { status: 503 })
}