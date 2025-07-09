'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { RankedGolfCourse } from '@/types/golf'
import { getUserRankings } from '@/lib/enhanced-golf'
import { useAuth } from '@/context/AuthContext'

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
})

export function CourseMap() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<RankedGolfCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadCourses()
    }
  }, [user, loadCourses])

  const loadCourses = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const rankings = await getUserRankings(user.id)
      const coursesWithCoords = rankings.filter(course => 
        course.latitude && course.longitude
      )
      setCourses(coursesWithCoords)
    } catch (err) {
      setError('Failed to load courses')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Course Map</h2>
        <p className="text-gray-500">Please sign in to view your golf course map</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Course Map</h2>
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Course Map</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={loadCourses}
          className="text-blue-500 hover:text-blue-700"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Course Map</h2>
      {courses.length === 0 ? (
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No courses with coordinates found. Add location data to see courses on the map.</p>
        </div>
      ) : (
        <Map courses={courses} />
      )}
    </div>
  )
}