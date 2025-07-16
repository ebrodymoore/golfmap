'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { AddCourseButton } from '../../components/AddCourseButton'

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

  const handleCourseAdded = () => {
    // Refresh courses list when a new course is added
    // TODO: Implement course fetching
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Golf Courses</h2>
        <AddCourseButton onCourseAdded={handleCourseAdded} />
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
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No golf courses added yet.</p>
          <p className="text-sm text-gray-400">
            Click &quot;Add Course&quot; to start building your golf course list.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{course.name}</h3>
                  <p className="text-gray-600">{course.location}, {course.country}</p>
                  <p className="text-sm text-blue-600 font-medium">Rank: #{course.rank}</p>
                  {course.notes && <p className="text-sm text-gray-500 mt-2">{course.notes}</p>}
                  {course.date_played && (
                    <p className="text-xs text-gray-400 mt-1">Played: {course.date_played}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}