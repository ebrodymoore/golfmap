import { NextRequest, NextResponse } from 'next/server'
import { 
  importFamousCourses, 
  importRegionalCourses, 
  importAllCourses,
  bulkImportCourses,
  BULK_IMPORT_REGIONS,
  FAMOUS_COURSES_QUERIES
} from '@/lib/bulk-import'

export async function POST(request: NextRequest) {
  try {
    const { type, regions, maxPerQuery, delay } = await request.json()

    let result

    switch (type) {
      case 'famous':
        result = await importFamousCourses()
        break
      
      case 'regional':
        result = await importRegionalCourses()
        break
      
      case 'all':
        result = await importAllCourses()
        break
      
      case 'custom':
        if (!regions || !Array.isArray(regions)) {
          return NextResponse.json(
            { error: 'Custom import requires regions array' },
            { status: 400 }
          )
        }
        result = await bulkImportCourses(
          regions, 
          maxPerQuery || 20, 
          delay || 1000
        )
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid import type. Use "famous", "regional", "all", or "custom"' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: 'Bulk import completed',
      result
    })

  } catch (error) {
    console.error('Error in bulk import:', error)
    return NextResponse.json(
      { error: 'Failed to bulk import courses', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Golf Course Bulk Import API',
    endpoints: {
      'POST /api/enhanced-bulk-import': {
        description: 'Bulk import golf courses',
        parameters: {
          type: 'famous | regional | all | custom',
          regions: 'Array of search queries (required for custom type)',
          maxPerQuery: 'Max results per query (default: 20)',
          delay: 'Delay between requests in ms (default: 1000)'
        }
      }
    },
    availableRegions: BULK_IMPORT_REGIONS.length,
    famousCourses: FAMOUS_COURSES_QUERIES.length,
    estimatedTotal: `${BULK_IMPORT_REGIONS.length * 15 + FAMOUS_COURSES_QUERIES.length * 5} courses`
  })
}