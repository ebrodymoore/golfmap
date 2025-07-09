'use client'

import { useState, useEffect } from 'react'
import { RankedGolfCourse } from '@/types/golf'
import { getUserRankings, reorderRankings } from '@/lib/enhanced-golf'
import { useAuth } from '@/context/AuthContext'
import { CourseCard } from './CourseCard'
import { AddCourseButton } from './AddCourseButton'
import { CourseSearch } from './CourseSearch'

export function CourseList() {
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
      setCourses(rankings)
    } catch (err) {
      setError('Failed to load courses')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReorder = async (courseId: string, newRank: number) => {
    if (!user) return

    try {
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          return { ...course, rank: newRank }
        }
        if (course.rank >= newRank) {
          return { ...course, rank: course.rank + 1 }
        }
        return course
      })

      setCourses(updatedCourses.sort((a, b) => a.rank - b.rank))

      const rankings = updatedCourses.map(course => ({
        id: course.id,
        rank: course.rank
      }))

      await reorderRankings(user.id, rankings)
    } catch (err) {
      setError('Failed to reorder courses')
      console.error(err)
      loadCourses()
    }
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please sign in to view your golf courses</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading your courses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={loadCourses}
          className="mt-2 text-blue-500 hover:text-blue-700"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Golf Courses</h2>
        <AddCourseButton onCourseAdded={loadCourses} />
      </div>

      <CourseSearch onCourseAdded={loadCourses} />

      {courses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No golf courses yet. Add your first course!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onReorder={handleReorder}
              onUpdate={loadCourses}
            />
          ))}
        </div>
      )}
    </div>
  )
}