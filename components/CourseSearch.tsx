'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

interface CourseSearchProps {
  onCourseAdded: () => void
}

export function CourseSearch({ onCourseAdded }: CourseSearchProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">🚧 Course Search (Coming Soon)</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700 mb-2">
          <strong>Search functionality is temporarily disabled.</strong>
        </p>
        <p className="text-sm text-blue-600">
          Use the &quot;Add Course&quot; button above to manually add golf courses for now. 
          Advanced search and Google integration will be available soon!
        </p>
      </div>
    </div>
  )
}