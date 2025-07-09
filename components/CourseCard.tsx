'use client'

import { useState } from 'react'
import { RankedGolfCourse } from '@/types/golf'
import { deleteRanking } from '@/lib/enhanced-golf'
import { useAuth } from '@/context/AuthContext'
import { CourseDetails } from './CourseDetails'

interface CourseCardProps {
  course: RankedGolfCourse
  onReorder: (courseId: string, newRank: number) => void
  onUpdate: () => void
}

export function CourseCard({ course, onReorder, onUpdate }: CourseCardProps) {
  const { user } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleDelete = async () => {
    if (!user || !confirm('Are you sure you want to remove this course?')) return

    try {
      setIsDeleting(true)
      await deleteRanking(course.id)
      onUpdate()
    } catch (err) {
      console.error('Failed to delete course:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleMoveUp = () => {
    if (course.rank > 1) {
      onReorder(course.id, course.rank - 1)
    }
  }

  const handleMoveDown = () => {
    onReorder(course.id, course.rank + 1)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1 cursor-pointer" onClick={() => setShowDetails(true)}>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-100 text-blue-800 text-lg font-bold px-3 py-1 rounded-full">
                #{course.rank}
              </span>
              <h3 className="text-xl font-semibold hover:text-blue-600">{course.name}</h3>
            </div>
          
          <p className="text-gray-600 mb-2">{course.location}, {course.country}</p>
          
          {course.description && (
            <p className="text-gray-700 mb-3">{course.description}</p>
          )}
          
          {course.notes && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-500">Notes:</span>
              <p className="text-gray-700">{course.notes}</p>
            </div>
          )}
          
          {course.date_played && (
            <p className="text-sm text-gray-500">
              Played on: {new Date(course.date_played).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <div className="flex gap-1">
            <button
              onClick={handleMoveUp}
              disabled={course.rank === 1}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              ↑
            </button>
            <button
              onClick={handleMoveDown}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              ↓
            </button>
          </div>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 disabled:opacity-50 rounded"
          >
            {isDeleting ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
      
      {showDetails && (
        <CourseDetails
          course={course}
          onClose={() => setShowDetails(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}