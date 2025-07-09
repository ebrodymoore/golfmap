'use client'

import { useState, useEffect } from 'react'

interface DatabaseStats {
  totalCourses: number
  coursesWithCoordinates: number
  coursesByCountry: Record<string, number>
  coursesByType: Record<string, number>
  coursesBySource: Record<string, number>
  ratingStats: {
    avgRating: number
    avgReviews: number
    totalRated: number
  }
  recentCourses: Array<{
    name: string
    country: string
    created_at: string
  }>
}

export function DatabaseStats() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/database-stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      
      const data = await response.json()
      setStats(data.stats)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-4"></div>
          <div className="h-8 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-600">Error: {error}</div>
        <button 
          onClick={fetchStats}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">📊 Database Statistics</h3>
      
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800">Total Courses</h4>
            <p className="text-3xl font-bold text-blue-600">{stats.totalCourses?.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800">With Coordinates</h4>
            <p className="text-3xl font-bold text-green-600">{stats.coursesWithCoordinates?.toLocaleString()}</p>
            <p className="text-sm text-green-600">
              {stats.totalCourses ? Math.round((stats.coursesWithCoordinates / stats.totalCourses) * 100) : 0}% coverage
            </p>
          </div>
        </div>

        {/* Rating Stats */}
        {stats.ratingStats && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Rating Statistics</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Avg Rating:</span>
                <span className="ml-2 text-yellow-600">⭐ {stats.ratingStats.avgRating}</span>
              </div>
              <div>
                <span className="font-medium">Avg Reviews:</span>
                <span className="ml-2 text-yellow-600">{stats.ratingStats.avgReviews}</span>
              </div>
              <div>
                <span className="font-medium">Rated Courses:</span>
                <span className="ml-2 text-yellow-600">{stats.ratingStats.totalRated}</span>
              </div>
            </div>
          </div>
        )}

        {/* Top Countries */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Top Countries</h4>
          <div className="space-y-2">
            {Object.entries(stats.coursesByCountry || {})
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([country, count]) => (
                <div key={country} className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">{country}</span>
                  <span className="text-sm font-medium text-gray-800">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Course Types */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Course Types</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(stats.coursesByType || {}).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600 capitalize">{type}</span>
                <span className="text-sm font-medium text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Data Sources</h4>
          <div className="space-y-2">
            {Object.entries(stats.coursesBySource || {}).map(([source, count]) => (
              <div key={source} className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600 capitalize">{source}</span>
                <span className="text-sm font-medium text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Additions */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Recent Additions</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {stats.recentCourses?.map((course, index) => (
              <div key={index} className="flex justify-between items-center py-1">
                <div>
                  <span className="text-sm font-medium text-gray-800">{course.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{course.country}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(course.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="pt-4 border-t">
          <button
            onClick={fetchStats}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium"
          >
            🔄 Refresh Stats
          </button>
        </div>
      </div>
    </div>
  )
}