'use client'

import { useState } from 'react'
import { BulkImportResult } from '@/types/enhanced-golf'

interface ImportStatus {
  isRunning: boolean
  progress: string
  result?: BulkImportResult
  error?: string
}

export function EnhancedAdminPanel() {
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    isRunning: false,
    progress: ''
  })

  const handleBulkImport = async (type: string) => {
    setImportStatus({
      isRunning: true,
      progress: `Starting ${type} import...`
    })

    try {
      const response = await fetch('/api/enhanced-bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      setImportStatus({
        isRunning: false,
        progress: 'Import completed!',
        result: data.result
      })

    } catch (error) {
      setImportStatus({
        isRunning: false,
        progress: 'Import failed',
        error: error.message
      })
    }
  }

  const handleCustomImport = async () => {
    const customRegions = [
      'top golf courses California',
      'best golf courses Florida',
      'championship golf courses Scotland',
      'resort golf courses Hawaii',
      'municipal golf courses New York'
    ]

    setImportStatus({
      isRunning: true,
      progress: 'Starting custom import...'
    })

    try {
      const response = await fetch('/api/enhanced-bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          type: 'custom',
          regions: customRegions,
          maxPerQuery: 10,
          delay: 500
        })
      })

      const data = await response.json()
      
      setImportStatus({
        isRunning: false,
        progress: 'Custom import completed!',
        result: data.result
      })

    } catch (error) {
      setImportStatus({
        isRunning: false,
        progress: 'Custom import failed',
        error: error.message
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">🏌️ Golf Course Database Manager</h3>
      
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800">Famous Courses</h4>
            <p className="text-2xl font-bold text-blue-600">50+</p>
            <p className="text-sm text-blue-600">World-renowned courses</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800">Regional Coverage</h4>
            <p className="text-2xl font-bold text-green-600">80+</p>
            <p className="text-sm text-green-600">Countries & regions</p>
          </div>
        </div>

        {/* Import Options */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700">Import Options</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleBulkImport('famous')}
              disabled={importStatus.isRunning}
              className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium disabled:opacity-50 text-left"
            >
              <div className="font-semibold">Famous Courses</div>
              <div className="text-sm opacity-90">~250 world-class courses</div>
              <div className="text-xs opacity-75">Augusta, St. Andrews, Pebble Beach...</div>
            </button>

            <button
              onClick={() => handleBulkImport('regional')}
              disabled={importStatus.isRunning}
              className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 text-left"
            >
              <div className="font-semibold">Regional Courses</div>
              <div className="text-sm opacity-90">~1,200 courses worldwide</div>
              <div className="text-xs opacity-75">USA, Canada, Europe, Asia...</div>
            </button>

            <button
              onClick={() => handleBulkImport('all')}
              disabled={importStatus.isRunning}
              className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 text-left"
            >
              <div className="font-semibold">Complete Database</div>
              <div className="text-sm opacity-90">~1,500 courses total</div>
              <div className="text-xs opacity-75">Famous + Regional (⚠️ High API usage)</div>
            </button>

            <button
              onClick={handleCustomImport}
              disabled={importStatus.isRunning}
              className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 text-left"
            >
              <div className="font-semibold">Custom Import</div>
              <div className="text-sm opacity-90">~50 targeted courses</div>
              <div className="text-xs opacity-75">Curated selection</div>
            </button>
          </div>
        </div>

        {/* Status Display */}
        {importStatus.isRunning && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
              <span className="text-blue-700 font-medium">{importStatus.progress}</span>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              This may take several minutes. Please don't close the browser.
            </p>
          </div>
        )}

        {/* Results Display */}
        {importStatus.result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Import Results</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-700">Success:</span>
                <span className="ml-2 text-green-600">{importStatus.result.success}</span>
              </div>
              <div>
                <span className="font-medium text-yellow-700">Duplicates:</span>
                <span className="ml-2 text-yellow-600">{importStatus.result.duplicates}</span>
              </div>
              <div>
                <span className="font-medium text-red-700">Failed:</span>
                <span className="ml-2 text-red-600">{importStatus.result.failed}</span>
              </div>
            </div>
            {importStatus.result.errors.length > 0 && (
              <details className="mt-3">
                <summary className="text-sm font-medium text-red-700 cursor-pointer">
                  View Errors ({importStatus.result.errors.length})
                </summary>
                <div className="mt-2 max-h-40 overflow-y-auto">
                  {importStatus.result.errors.map((error, index) => (
                    <p key={index} className="text-xs text-red-600 mb-1">{error}</p>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* Error Display */}
        {importStatus.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">Import Error</h4>
            <p className="text-sm text-red-600">{importStatus.error}</p>
          </div>
        )}

        {/* Setup Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">⚠️ Before You Start</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Ensure Google Maps API key is configured in .env.local</li>
            <li>• Enable Places API in Google Cloud Console</li>
            <li>• Set up billing (estimated cost: $50-200 for full import)</li>
            <li>• Monitor API quotas and rate limits</li>
            <li>• Run during off-peak hours for better performance</li>
          </ul>
        </div>

        {/* Database Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">📊 Database Features</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Comprehensive course information (facilities, ratings, contact)</li>
            <li>• Automatic coordinate lookup and geocoding</li>
            <li>• Duplicate detection and prevention</li>
            <li>• Full-text search capabilities</li>
            <li>• Performance-optimized indexes</li>
            <li>• Course statistics and analytics</li>
          </ul>
        </div>
      </div>
    </div>
  )
}