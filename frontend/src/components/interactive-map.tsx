"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Zap } from "lucide-react"

interface MapLocation {
  id: string
  lat: number
  lng: number
  name: string
  type: "donation" | "request" | "ngo"
  details: string
  urgency?: "low" | "medium" | "high" | "urgent"
}

interface InteractiveMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; name: string }) => void
  showLocationPicker?: boolean
}

export default function InteractiveMap({ onLocationSelect, showLocationPicker = false }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null)

  const locations: MapLocation[] = [
    {
      id: "1",
      lat: 24.8607,
      lng: 67.0011,
      name: "Karachi Central",
      type: "donation",
      details: "Ahmed Khan donated 20kg Rice - 2 hours ago",
    },
    {
      id: "2",
      lat: 31.5204,
      lng: 74.3587,
      name: "Lahore City",
      type: "request",
      details: "Khan Family needs monthly rations",
      urgency: "high",
    },
    {
      id: "3",
      lat: 33.6844,
      lng: 73.0479,
      name: "Islamabad",
      type: "ngo",
      details: "Capital Relief Foundation - Active NGO",
    },
    {
      id: "4",
      lat: 31.4504,
      lng: 73.135,
      name: "Faisalabad",
      type: "request",
      details: "Ali Family emergency food request",
      urgency: "urgent",
    },
    {
      id: "5",
      lat: 25.396,
      lng: 68.3578,
      name: "Hyderabad",
      type: "donation",
      details: "Anonymous donor - Cooking oil 5L",
    },
  ]

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!showLocationPicker) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Convert pixel coordinates to approximate lat/lng (simplified)
    const lat = 30 + (y / rect.height) * 10 // Rough Pakistan latitude range
    const lng = 65 + (x / rect.width) * 15 // Rough Pakistan longitude range

    const newLocation = { lat, lng }
    setClickedLocation(newLocation)

    // Reverse geocoding simulation
    const cityNames = ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi", "Multan", "Peshawar", "Quetta"]
    const randomCity = cityNames[Math.floor(Math.random() * cityNames.length)]

    if (onLocationSelect) {
      onLocationSelect({ ...newLocation, name: randomCity })
    }
  }

  const getMarkerColor = (type: string, urgency?: string) => {
    if (type === "donation") return "bg-green-500"
    if (type === "ngo") return "bg-blue-500"
    if (urgency === "urgent") return "bg-red-600"
    if (urgency === "high") return "bg-red-500"
    return "bg-orange-500"
  }

  const getMarkerIcon = (type: string) => {
    if (type === "donation") return "🎁"
    if (type === "ngo") return "🏢"
    return "🆘"
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div
            className="h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg relative overflow-hidden cursor-pointer"
            onClick={handleMapClick}
          >
            {/* Map Background */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                <path
                  d="M50 150 Q100 100 150 120 T250 140 Q300 160 350 130"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-primary"
                />
                <path
                  d="M80 200 Q130 180 180 190 T280 200 Q320 210 360 180"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  className="text-muted-foreground"
                />
              </svg>
            </div>

            {/* Location Markers */}
            {locations.map((location) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${((location.lng - 65) / 15) * 100}%`,
                  top: `${((location.lat - 25) / 15) * 100}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedLocation(location)
                }}
              >
                <div
                  className={`w-6 h-6 ${getMarkerColor(location.type, location.urgency)} rounded-full flex items-center justify-center text-white text-xs animate-pulse shadow-lg`}
                >
                  {getMarkerIcon(location.type)}
                </div>
                {selectedLocation?.id === location.id && (
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border min-w-48 z-10">
                    <h4 className="font-semibold text-sm">{location.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{location.details}</p>
                    {location.urgency && (
                      <Badge
                        variant={location.urgency === "urgent" ? "destructive" : "default"}
                        className="mt-2 text-xs"
                      >
                        {location.urgency}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Clicked Location Marker */}
            {clickedLocation && showLocationPicker && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${((clickedLocation.lng - 65) / 15) * 100}%`,
                  top: `${((clickedLocation.lat - 25) / 15) * 100}%`,
                }}
              >
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white animate-bounce shadow-lg">
                  <Navigation className="h-4 w-4" />
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Pakistan Relief Map
              </h3>
              {showLocationPicker ? (
                <p className="text-xs text-muted-foreground">Click anywhere to select location</p>
              ) : (
                <p className="text-xs text-muted-foreground">Click markers to view details</p>
              )}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg">
              <h4 className="font-semibold text-xs mb-2">Legend</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Donations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Requests</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>NGOs</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => setSelectedLocation(null)}>
          Clear Selection
        </Button>
        {showLocationPicker && clickedLocation && (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Location Selected
          </Button>
        )}
      </div>
    </div>
  )
}
