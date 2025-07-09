'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

interface RankedGolfCourse {
  id: string
  name: string
  location: string
  country: string
  rank: number
  notes?: string
  date_played?: string
}

export function CourseList() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<RankedGolfCourse[]>([])
  const [loading, setLoading] = useState(false)

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Golf Courses</h2>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">🏌️ Welcome to GolfMap!</h3>
          <p className="text-blue-700 mb-4">
            Track and rank your favorite golf courses from around the world.
          </p>
          <div className="space-y-2 text-sm text-blue-600">
            <p>✅ <strong>Core Features Available:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Manual course entry with coordinates</li>
              <li>Personal ranking system</li>
              <li>Interactive map visualization</li>
              <li>Course details and notes</li>
            </ul>
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
            <p className="text-sm text-amber-700">
              <strong>Setup Required:</strong> Add your Supabase credentials to .env.local to enable full functionality.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Golf Courses</h2>
      </div>

      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Database not configured yet.</p>
        <p className="text-sm text-gray-400">
          Add your Supabase credentials to start tracking courses.
        </p>
      </div>
    </div>
  )
}