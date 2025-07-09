'use client'

import { useState } from 'react'
import { RankedGolfCourse } from '../types/golf'
import { updateRanking } from '../lib/enhanced-golf'
import { useAuth } from '../context/AuthContext'

interface CourseDetailsProps {
  course: RankedGolfCourse
  onClose: () => void
  onUpdate: () => void
}

export function CourseDetails({ course, onClose, onUpdate }: CourseDetailsProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    notes: course.notes || '',
    date_played: course.date_played || ''
  })

  const handleSave = async () => {
    if (!user) return

    try {
      setLoading(true)
      await updateRanking(course.id, {
        notes: formData.notes || undefined,
        date_played: formData.date_played || undefined
      })
      setIsEditing(false)
      onUpdate()
    } catch (err) {
      console.error('Failed to update course:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      notes: course.notes || '',
      date_played: course.date_played || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 text-xl font-bold px-4 py-2 rounded-full">
                #{course.rank}
              </span>
              <div>
                <h2 className="text-2xl font-bold">{course.name}</h2>
                <p className="text-gray-600">{course.location}, {course.country}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {course.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Course Description</h3>
              <p className="text-gray-700">{course.description}</p>
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Personal Notes</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add your thoughts about this course..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Played
                  </label>
                  <input
                    type="date"
                    value={formData.date_played}
                    onChange={(e) => setFormData({ ...formData, date_played: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-gray-700 min-h-[3rem]">
                    {course.notes || 'No notes added yet.'}
                  </p>
                </div>
                {course.date_played && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Date Played:</span>
                    <p className="text-gray-700">
                      {new Date(course.date_played).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {course.latitude && course.longitude && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Location</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Coordinates: {course.latitude.toFixed(6)}, {course.longitude.toFixed(6)}
                </p>
                <a
                  href={`https://maps.google.com/maps?q=${course.latitude},${course.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm mt-2 inline-block"
                >
                  View on Google Maps →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}