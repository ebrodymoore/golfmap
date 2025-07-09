'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { LatLngBounds, Icon } from 'leaflet'
import { RankedGolfCourse } from '../types/golf'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  courses: RankedGolfCourse[]
}

const MapUpdater = ({ courses }: { courses: RankedGolfCourse[] }) => {
  const map = useMap()
  
  useEffect(() => {
    if (courses.length > 0) {
      const bounds = new LatLngBounds([])
      courses.forEach(course => {
        if (course.latitude && course.longitude) {
          bounds.extend([course.latitude, course.longitude])
        }
      })
      
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] })
      }
    }
  }, [courses, map])

  return null
}

const customIcon = new Icon({
  iconUrl: '/golf-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: '/golf-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [13, 41]
})

const fallbackIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [13, 41]
})

export default function Map({ courses }: MapProps) {
  const [iconToUse, setIconToUse] = useState(fallbackIcon)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setIconToUse(customIcon)
    img.onerror = () => setIconToUse(fallbackIcon)
    img.src = '/golf-icon.png'
  }, [])

  const getRankColor = (rank: number) => {
    if (rank <= 3) return 'text-yellow-600'
    if (rank <= 10) return 'text-green-600'
    return 'text-blue-600'
  }

  return (
    <MapContainer
      center={[39.8283, -98.5795]}
      zoom={4}
      className="h-96 w-full rounded-lg"
      style={{ height: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater courses={courses} />
      
      {courses.map((course) => (
        course.latitude && course.longitude && (
          <Marker
            key={course.id}
            position={[course.latitude, course.longitude]}
            icon={iconToUse}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-bold text-lg ${getRankColor(course.rank)}`}>
                    #{course.rank}
                  </span>
                  <h3 className="font-semibold">{course.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {course.location}, {course.country}
                </p>
                {course.description && (
                  <p className="text-sm text-gray-700 mb-2">{course.description}</p>
                )}
                {course.notes && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500">Notes:</span>
                    <p className="text-sm text-gray-700">{course.notes}</p>
                  </div>
                )}
                {course.date_played && (
                  <p className="text-xs text-gray-500">
                    Played: {new Date(course.date_played).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  )
}