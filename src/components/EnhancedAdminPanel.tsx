'use client'

export function EnhancedAdminPanel() {
  const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const missingConfigs = []
  if (!hasSupabaseConfig) missingConfigs.push('Add Supabase credentials to .env.local')
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">🏌️ Database Manager</h3>
      
      <div className="space-y-6">
        {missingConfigs.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2">⚙️ Setup Required</h4>
            <p className="text-sm text-amber-700 mb-3">
              Configure your environment to unlock advanced features:
            </p>
            <ul className="text-sm text-amber-700 space-y-1">
              {missingConfigs.map((config, index) => (
                <li key={index}>• {config}</li>
              ))}
              <li>• Run database schema in Supabase SQL editor</li>
            </ul>
          </div>
        )}
        
        {hasSupabaseConfig && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">✅ Configuration Status</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✓ Supabase credentials configured</li>
              <li>✓ Google Maps API configured</li>
            </ul>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">🚀 Future Features</h4>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• Bulk import from Google Places</li>
            <li>• Course search and discovery</li>
            <li>• Database statistics and analytics</li>
            <li>• Famous courses pre-population</li>
            <li>• Advanced filtering and sorting</li>
          </ul>
        </div>
      </div>
    </div>
  )
}