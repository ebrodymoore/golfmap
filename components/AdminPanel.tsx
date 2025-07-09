'use client'

import { useState } from 'react'

export function AdminPanel() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handlePopulateCourses = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/populate-courses', {
        method: 'POST'
      })

      if (response.ok) {
        setMessage('✅ Famous courses populated successfully!')
      } else {
        setMessage('❌ Failed to populate courses')
      }
    } catch (error) {
      setMessage('❌ Error populating courses')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Admin Tools</h3>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={handlePopulateCourses}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md disabled:opacity-50"
          >
            {loading ? 'Populating...' : 'Populate Famous Courses'}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Adds 20 world-famous golf courses to the database with Google Maps data
          </p>
        </div>

        {message && (
          <div className="p-3 rounded-md bg-gray-100">
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h4 className="font-medium text-yellow-800 mb-2">Setup Required:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Add your Google Maps API key to .env.local</li>
          <li>• Enable Places API in Google Cloud Console</li>
          <li>• Set up billing for Google Maps Platform</li>
        </ul>
      </div>
    </div>
  )
}