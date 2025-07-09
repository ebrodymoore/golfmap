'use client'

export function EnhancedAdminPanel() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">🏌️ Database Manager (Coming Soon)</h3>
      
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">🚧 Advanced Features Disabled</h4>
          <p className="text-sm text-amber-700 mb-3">
            Bulk import and database management features are temporarily disabled for this deployment.
          </p>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Use the &quot;Add Course&quot; button to manually add courses</li>
            <li>• Basic course management is fully functional</li>
            <li>• Advanced features will be enabled in future updates</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">✅ Available Features</h4>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• Manual course entry with coordinates</li>
            <li>• Personal course ranking system</li>
            <li>• Interactive map visualization</li>
            <li>• Course details and notes</li>
            <li>• Drag-and-drop ranking reorder</li>
          </ul>
        </div>
      </div>
    </div>
  )
}