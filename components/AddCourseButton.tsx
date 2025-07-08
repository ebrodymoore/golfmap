'use client'

import { useState } from 'react'
import { AddCourseModal } from './AddCourseModal'

interface AddCourseButtonProps {
  onCourseAdded: () => void
}

export function AddCourseButton({ onCourseAdded }: AddCourseButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCourseAdded = () => {
    setIsModalOpen(false)
    onCourseAdded()
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
      >
        Add Course
      </button>
      
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCourseAdded={handleCourseAdded}
      />
    </>
  )
}