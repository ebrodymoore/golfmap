import { Client } from '@googlemaps/google-maps-services-js'
import { supabase } from '../src/lib/supabase'
import { CreateGolfCourseInput } from '../types/golf'

const googleMapsClient = new Client({})

export interface CourseSearchResult {
  name: string
  location: string
  country: string
  latitude: number
  longitude: number
  description?: string
  rating?: number
  website?: string
  phone?: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function searchCoursesWithGoogle(
  query: string, 
  location?: string
): Promise<CourseSearchResult[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error('Google Maps API key not configured')
  }

  try {
    const response = await googleMapsClient.textSearch({
      params: {
        query: `${query} golf course`,
        location: location,
        key: apiKey
      }
    })

    const courses = response.data.results
      .filter((place: any) => 
        place.types?.includes('establishment') && 
        place.name?.toLowerCase().includes('golf')
      )
      .map((place: any) => ({
        name: place.name || '',
        location: place.formatted_address?.split(',')[0] || '',
        country: place.formatted_address?.split(',').pop()?.trim() || '',
        latitude: place.geometry?.location?.lat || 0,
        longitude: place.geometry?.location?.lng || 0,
        description: place.types?.join(', '),
        rating: place.rating,
        website: place.website,
        phone: place.formatted_phone_number
      }))

    return courses
  } catch (error) {
    console.error('Error searching courses:', error)
    throw error
  }
}

export async function importCourseToDatabase(course: CourseSearchResult): Promise<void> {
  const courseData: CreateGolfCourseInput = {
    name: course.name,
    location: course.location,
    country: course.country,
    latitude: course.latitude,
    longitude: course.longitude,
    description: course.description
  }

  const { error } = await supabase
    .from('golf_courses')
    .insert(courseData)

  if (error) {
    throw error
  }
}

export async function searchExistingCourses(searchTerm: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('golf_courses')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%`)
    .limit(20)

  if (error) throw error
  return data || []
}

export const FAMOUS_GOLF_COURSES = [
  { name: 'Augusta National Golf Club', location: 'Augusta, Georgia', country: 'USA' },
  { name: 'St. Andrews Old Course', location: 'St Andrews, Fife', country: 'Scotland' },
  { name: 'Pebble Beach Golf Links', location: 'Pebble Beach, California', country: 'USA' },
  { name: 'Pinehurst No. 2', location: 'Pinehurst, North Carolina', country: 'USA' },
  { name: 'Royal County Down', location: 'Newcastle, County Down', country: 'Northern Ireland' },
  { name: 'Cypress Point Club', location: 'Pebble Beach, California', country: 'USA' },
  { name: 'Royal Melbourne Golf Club', location: 'Melbourne, Victoria', country: 'Australia' },
  { name: 'Shinnecock Hills Golf Club', location: 'Southampton, New York', country: 'USA' },
  { name: 'Muirfield', location: 'Gullane, East Lothian', country: 'Scotland' },
  { name: 'Oakmont Country Club', location: 'Oakmont, Pennsylvania', country: 'USA' },
  { name: 'Royal Birkdale Golf Club', location: 'Southport, England', country: 'England' },
  { name: 'Turnberry', location: 'Turnberry, South Ayrshire', country: 'Scotland' },
  { name: 'Whistling Straits', location: 'Sheboygan, Wisconsin', country: 'USA' },
  { name: 'Royal Troon Golf Club', location: 'Troon, South Ayrshire', country: 'Scotland' },
  { name: 'Bandon Dunes Golf Resort', location: 'Bandon, Oregon', country: 'USA' },
  { name: 'Casa de Campo', location: 'La Romana', country: 'Dominican Republic' },
  { name: 'Royal Portrush Golf Club', location: 'Portrush, County Antrim', country: 'Northern Ireland' },
  { name: 'Kiawah Island Golf Resort', location: 'Kiawah Island, South Carolina', country: 'USA' },
  { name: 'Carnoustie Golf Links', location: 'Carnoustie, Angus', country: 'Scotland' },
  { name: 'Bethpage Black', location: 'Farmingdale, New York', country: 'USA' }
]

export async function populateFamousCourses(): Promise<void> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    console.warn('Google Maps API key not configured, skipping famous courses population')
    return
  }

  for (const course of FAMOUS_GOLF_COURSES) {
    try {
      const existingCourse = await supabase
        .from('golf_courses')
        .select('id')
        .eq('name', course.name)
        .single()

      if (existingCourse.data) {
        console.log(`Course ${course.name} already exists, skipping`)
        continue
      }

      const response = await googleMapsClient.textSearch({
        params: {
          query: `${course.name} golf course`,
          key: apiKey
        }
      })

      if (response.data.results.length > 0) {
        const place = response.data.results[0]
        await importCourseToDatabase({
          name: course.name,
          location: course.location,
          country: course.country,
          latitude: place.geometry?.location?.lat || 0,
          longitude: place.geometry?.location?.lng || 0,
          description: 'Famous golf course',
          rating: place.rating
        })
        console.log(`Added ${course.name} to database`)
      }
    } catch (error) {
      console.error(`Error adding ${course.name}:`, error)
    }
  }
}