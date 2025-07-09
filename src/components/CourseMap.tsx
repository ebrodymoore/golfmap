'use client'

import { useAuth } from '../context/AuthContext'

export function CourseMap() {
  const { user } = useAuth()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Course Map</h2>
      
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-gray-500 mb-2">Interactive Map Coming Soon</p>
          <p className="text-sm text-gray-400">
            Add courses with coordinates to see them on the map
          </p>
        </div>
      </div>
    </div>
  )
}