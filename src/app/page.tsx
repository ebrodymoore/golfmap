import { CourseList } from '@/components/CourseList'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GolfMap</h1>
              <p className="text-gray-600">Track and rank your favorite golf courses</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Authentication coming soon</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CourseList />
      </main>
    </div>
  )
}