'use client'

import { useState } from 'react'
import { searchExistingCourses, searchCoursesWithGoogle, importCourseToDatabase, CourseSearchResult } from '@/lib/course-data'
import { createRanking, getUserRankings } from '@/lib/enhanced-golf'
import { useAuth } from '@/context/AuthContext'
import { GolfCourse } from '@/types/golf'

interface CourseSearchProps {
  onCourseAdded: () => void
}

export function CourseSearch({ onCourseAdded }: CourseSearchProps) {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<(GolfCourse | CourseSearchResult)[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    setError(null)

    try {
      const existingCourses = await searchExistingCourses(searchTerm)
      let allResults = [...existingCourses]

      try {
        const googleResults = await searchCoursesWithGoogle(searchTerm)
        allResults = [...allResults, ...googleResults]
      } catch (googleError) {
        console.warn('Google search failed, showing only existing courses:', googleError)
      }

      setSearchResults(allResults)
    } catch (err) {
      setError('Failed to search courses')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCourse = async (course: GolfCourse | CourseSearchResult) => {
    if (!user) return

    try {
      let courseId: string

      if ('id' in course) {
        courseId = course.id
      } else {
        await importCourseToDatabase(course)
        const { data } = await searchExistingCourses(course.name)
        courseId = data?.[0]?.id
      }

      if (!courseId) {
        throw new Error('Failed to get course ID')
      }

      const existingRankings = await getUserRankings(user.id)
      const nextRank = existingRankings.length + 1

      await createRanking(user.id, {
        golf_course_id: courseId,
        rank: nextRank
      })

      onCourseAdded()
      setSearchResults([])
      setSearchTerm('')
    } catch (err) {
      setError('Failed to add course')
      console.error(err)
    }
  }

  const isExistingCourse = (course: GolfCourse | CourseSearchResult): course is GolfCourse => {
    return 'id' in course
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Search & Add Golf Courses</h3>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for golf courses..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Search Results:</h4>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {searchResults.map((course, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <h5 className="font-medium">{course.name}</h5>
                  <p className="text-sm text-gray-600">
                    {course.location}, {course.country}
                  </p>
                  {course.description && (
                    <p className="text-xs text-gray-500 mt-1">{course.description}</p>
                  )}
                  {'rating' in course && course.rating && (
                    <p className="text-xs text-yellow-600 mt-1">
                      ⭐ {course.rating}/5
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleAddCourse(course)}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
                >
                  {isExistingCourse(course) ? 'Add to List' : 'Import & Add'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>
          💡 Search for golf courses by name or location. 
          We'll search both our database and find new courses online.
        </p>
      </div>
    </div>
  )
}