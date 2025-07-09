import { Client } from '@googlemaps/google-maps-services-js'
import { supabase } from './supabase'
import { CreateEnhancedGolfCourseInput, BulkImportResult } from '@/types/enhanced-golf'

const googleMapsClient = new Client({})

// Comprehensive list of regions and search terms for bulk import
export const BULK_IMPORT_REGIONS = [
  // United States - by state
  'golf courses California USA',
  'golf courses Florida USA',
  'golf courses Texas USA',
  'golf courses New York USA',
  'golf courses Arizona USA',
  'golf courses North Carolina USA',
  'golf courses South Carolina USA',
  'golf courses Georgia USA',
  'golf courses Michigan USA',
  'golf courses Nevada USA',
  'golf courses Hawaii USA',
  'golf courses Colorado USA',
  'golf courses Utah USA',
  'golf courses Oregon USA',
  'golf courses Washington USA',
  'golf courses Virginia USA',
  'golf courses Maryland USA',
  'golf courses Pennsylvania USA',
  'golf courses Illinois USA',
  'golf courses Ohio USA',
  'golf courses Wisconsin USA',
  'golf courses Minnesota USA',
  'golf courses Massachusetts USA',
  'golf courses Connecticut USA',
  'golf courses New Jersey USA',
  'golf courses Tennessee USA',
  'golf courses Kentucky USA',
  'golf courses Alabama USA',
  'golf courses Mississippi USA',
  'golf courses Louisiana USA',
  'golf courses Arkansas USA',
  'golf courses Missouri USA',
  'golf courses Iowa USA',
  'golf courses Kansas USA',
  'golf courses Oklahoma USA',
  'golf courses New Mexico USA',
  'golf courses Montana USA',
  'golf courses Wyoming USA',
  'golf courses Idaho USA',
  'golf courses North Dakota USA',
  'golf courses South Dakota USA',
  'golf courses Nebraska USA',
  'golf courses Indiana USA',
  'golf courses West Virginia USA',
  'golf courses Maine USA',
  'golf courses New Hampshire USA',
  'golf courses Vermont USA',
  'golf courses Rhode Island USA',
  'golf courses Delaware USA',
  'golf courses Alaska USA',
  
  // International
  'golf courses Ontario Canada',
  'golf courses British Columbia Canada',
  'golf courses Alberta Canada',
  'golf courses Quebec Canada',
  'golf courses Scotland UK',
  'golf courses England UK',
  'golf courses Wales UK',
  'golf courses Ireland',
  'golf courses Northern Ireland',
  'golf courses Australia',
  'golf courses New Zealand',
  'golf courses Japan',
  'golf courses South Korea',
  'golf courses Thailand',
  'golf courses Philippines',
  'golf courses Singapore',
  'golf courses Malaysia',
  'golf courses Indonesia',
  'golf courses China',
  'golf courses Spain',
  'golf courses Portugal',
  'golf courses France',
  'golf courses Germany',
  'golf courses Italy',
  'golf courses Netherlands',
  'golf courses Belgium',
  'golf courses Switzerland',
  'golf courses Austria',
  'golf courses Denmark',
  'golf courses Sweden',
  'golf courses Norway',
  'golf courses Finland',
  'golf courses Turkey',
  'golf courses Dubai UAE',
  'golf courses South Africa',
  'golf courses Morocco',
  'golf courses Kenya',
  'golf courses Argentina',
  'golf courses Brazil',
  'golf courses Chile',
  'golf courses Mexico',
  'golf courses Costa Rica',
  'golf courses Dominican Republic',
  'golf courses Barbados',
  'golf courses Jamaica'
]

export const FAMOUS_COURSES_QUERIES = [
  'Augusta National Golf Club Georgia',
  'St Andrews Old Course Scotland',
  'Pebble Beach Golf Links California',
  'Pinehurst No 2 North Carolina',
  'Royal County Down Northern Ireland',
  'Cypress Point Club California',
  'Royal Melbourne Golf Club Australia',
  'Shinnecock Hills Golf Club New York',
  'Muirfield Scotland',
  'Oakmont Country Club Pennsylvania',
  'Royal Birkdale Golf Club England',
  'Turnberry Scotland',
  'Whistling Straits Wisconsin',
  'Royal Troon Golf Club Scotland',
  'Bandon Dunes Golf Resort Oregon',
  'Casa de Campo Dominican Republic',
  'Royal Portrush Golf Club Northern Ireland',
  'Kiawah Island Golf Resort South Carolina',
  'Carnoustie Golf Links Scotland',
  'Bethpage Black New York',
  'Torrey Pines Golf Course California',
  'Congressional Country Club Maryland',
  'Hazeltine National Golf Club Minnesota',
  'Baltusrol Golf Club New Jersey',
  'Merion Golf Club Pennsylvania',
  'Los Angeles Country Club California',
  'Winged Foot Golf Club New York',
  'Chicago Golf Club Illinois',
  'Sand Hills Golf Club Nebraska',
  'Pacific Dunes Oregon',
  'Fishers Island Club New York',
  'National Golf Links of America New York',
  'Sebonack Golf Club New York',
  'Friar\'s Head New York',
  'Streamsong Resort Florida',
  'Erin Hills Wisconsin',
  'Chambers Bay Washington',
  'Spyglass Hill Golf Course California',
  'Riviera Country Club California',
  'TPC Sawgrass Florida',
  'Bay Hill Club Florida',
  'Valhalla Golf Club Kentucky',
  'Medinah Country Club Illinois',
  'Cherry Hills Country Club Colorado',
  'Inverness Club Ohio',
  'Southern Hills Country Club Oklahoma',
  'Colonial Country Club Texas',
  'Muirfield Village Golf Club Ohio',
  'TPC Stadium Course Arizona',
  'Quail Hollow Club North Carolina'
]

export async function bulkImportCourses(
  searchQueries: string[],
  maxPerQuery: number = 20,
  delayBetweenRequests: number = 1000
): Promise<BulkImportResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error('Google Maps API key not configured')
  }

  let success = 0
  let failed = 0
  let duplicates = 0
  const errors: string[] = []

  console.log(`Starting bulk import of ${searchQueries.length} queries...`)

  for (let i = 0; i < searchQueries.length; i++) {
    const query = searchQueries[i]
    console.log(`Processing ${i + 1}/${searchQueries.length}: ${query}`)

    try {
      // Search for courses
      const response = await googleMapsClient.textSearch({
        params: {
          query: query,
          key: apiKey,
          type: 'establishment'
        }
      })

      const places = response.data.results
        .filter(place => 
          place.types?.includes('establishment') && 
          place.name?.toLowerCase().includes('golf')
        )
        .slice(0, maxPerQuery)

      // Process each place
      for (const place of places) {
        try {
          const courseData = await enrichCourseData(place)
          
          // Check if course already exists
          const { data: existingCourse } = await supabase
            .from('golf_courses')
            .select('id')
            .eq('name', courseData.name)
            .eq('country', courseData.country)
            .single()

          if (existingCourse) {
            duplicates++
            continue
          }

          // Insert course
          const { error } = await supabase
            .from('golf_courses')
            .insert(courseData)

          if (error) {
            failed++
            errors.push(`Failed to insert ${courseData.name}: ${error.message}`)
          } else {
            success++
            console.log(`✅ Added: ${courseData.name}`)
          }

        } catch (error) {
          failed++
          errors.push(`Error processing ${place.name}: ${error}`)
        }
      }

      // Rate limiting
      if (i < searchQueries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenRequests))
      }

    } catch (error) {
      failed++
      errors.push(`Error searching "${query}": ${error}`)
    }
  }

  const result = { success, failed, duplicates, errors }
  console.log('Bulk import completed:', result)
  return result
}

async function enrichCourseData(place: any): Promise<CreateEnhancedGolfCourseInput> {
  const addressComponents = place.address_components || []
  let city = ''
  let state_province = ''
  let country = ''
  let postal_code = ''

  // Parse address components
  for (const component of addressComponents) {
    const types = component.types || []
    if (types.includes('locality')) {
      city = component.long_name
    } else if (types.includes('administrative_area_level_1')) {
      state_province = component.long_name
    } else if (types.includes('country')) {
      country = component.long_name
    } else if (types.includes('postal_code')) {
      postal_code = component.long_name
    }
  }

  // Determine course type from place types
  let course_type: 'public' | 'private' | 'resort' | 'municipal' = 'public'
  if (place.types?.includes('lodging')) {
    course_type = 'resort'
  }

  return {
    name: place.name || '',
    location: place.formatted_address?.split(',')[0] || '',
    city,
    state_province,
    country,
    postal_code,
    latitude: place.geometry?.location?.lat,
    longitude: place.geometry?.location?.lng,
    description: place.editorial_summary?.overview || '',
    course_type,
    phone: place.formatted_phone_number,
    website: place.website,
    google_rating: place.rating,
    google_reviews_count: place.user_ratings_total,
    data_source: 'google',
    external_id: place.place_id,
    driving_range: place.types?.includes('gym') || false,
    pro_shop: place.types?.includes('store') || false,
    restaurant: place.types?.includes('restaurant') || false,
    lodging: place.types?.includes('lodging') || false
  }
}

export async function importFamousCourses(): Promise<BulkImportResult> {
  return bulkImportCourses(FAMOUS_COURSES_QUERIES, 5, 500)
}

export async function importRegionalCourses(): Promise<BulkImportResult> {
  return bulkImportCourses(BULK_IMPORT_REGIONS, 15, 1000)
}

export async function importAllCourses(): Promise<BulkImportResult> {
  console.log('Starting comprehensive course import...')
  
  const famousResult = await importFamousCourses()
  console.log('Famous courses imported:', famousResult)
  
  const regionalResult = await importRegionalCourses()
  console.log('Regional courses imported:', regionalResult)
  
  return {
    success: famousResult.success + regionalResult.success,
    failed: famousResult.failed + regionalResult.failed,
    duplicates: famousResult.duplicates + regionalResult.duplicates,
    errors: [...famousResult.errors, ...regionalResult.errors]
  }
}