import { searchCoursesWithGoogle, importCourseToDatabase } from '../lib/course-data'

// Bulk import courses by region
const REGIONS_TO_IMPORT = [
  'golf courses California USA',
  'golf courses Florida USA', 
  'golf courses Scotland UK',
  'golf courses Australia',
  'golf courses Japan',
  'golf courses South Africa'
]

// Top golf course lists to import
const TOP_COURSES_LISTS = [
  'Golf Digest top 100 courses',
  'PGA Tour venues',
  'US Open venues',
  'British Open venues',
  'Masters Tournament venue',
  'Ryder Cup venues'
]

export async function bulkImportByRegion() {
  console.log('Starting bulk import by region...')
  
  for (const region of REGIONS_TO_IMPORT) {
    try {
      console.log(`Importing courses for: ${region}`)
      const courses = await searchCoursesWithGoogle(region)
      
      for (const course of courses.slice(0, 10)) { // Limit to avoid API costs
        try {
          await importCourseToDatabase(course)
          console.log(`✅ Imported: ${course.name}`)
        } catch (error) {
          console.log(`❌ Failed to import ${course.name}:`, error)
        }
      }
      
      // Rate limiting - wait 1 second between regions
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.error(`Error importing ${region}:`, error)
    }
  }
}

export async function bulkImportTopCourses() {
  console.log('Starting bulk import of top courses...')
  
  for (const query of TOP_COURSES_LISTS) {
    try {
      console.log(`Searching for: ${query}`)
      const courses = await searchCoursesWithGoogle(query)
      
      for (const course of courses.slice(0, 5)) {
        try {
          await importCourseToDatabase(course)
          console.log(`✅ Imported: ${course.name}`)
        } catch (error) {
          console.log(`❌ Failed to import ${course.name}:`, error)
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.error(`Error importing ${query}:`, error)
    }
  }
}

// Run this script to populate thousands of courses
if (require.main === module) {
  console.log('Starting comprehensive course import...')
  console.log('This will import hundreds of courses - make sure you have sufficient API quota!')
  
  Promise.all([
    bulkImportByRegion(),
    bulkImportTopCourses()
  ]).then(() => {
    console.log('✅ Bulk import completed!')
  }).catch(error => {
    console.error('❌ Bulk import failed:', error)
  })
}