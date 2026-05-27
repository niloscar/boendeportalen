import { useEffect, useState } from 'react'
import type { ParkingSpot, UseParkingLocationResult } from '../types/parking'
import type { MapLocation } from '../types/map'

export default function useParkingLocation(spot: ParkingSpot | null | undefined): UseParkingLocationResult {
    const [location, setLocation] = useState<MapLocation | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [resolvedSpotId, setResolvedSpotId] = useState<number | null>(null)

    useEffect(() => {
        if (!spot) return

        let isActive = true

        const loadParkingLocation = async () => {
            try {
                setIsLoading(true)
                setHasError(false)
                setLocation(null)
                setResolvedSpotId(null)

                const searchTerm = `${spot.address}, ${spot.postalCode} ${spot.city}, Sweden`
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(searchTerm)}`)

                if (!response.ok) throw new Error('Kunde inte hämta kartdata')

                const results = await response.json() as Array<{ lat: string; lon: string }>
                const result = results[0]

                if (isActive && result) {
                    setLocation({
                        latitude: Number(result.lat),
                        longitude: Number(result.lon),
                    })
                    setResolvedSpotId(spot.id)
                } else if (isActive) {
                    setHasError(true)
                }
            } catch (error) {
                if (isActive) {
                    setHasError(true)
                }
                console.error('Fel vid hämtning av kartplats:', error)
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        void loadParkingLocation()

        return () => {
            isActive = false
        }
    }, [spot])

    const isCurrentSpot = spot && resolvedSpotId === spot.id

    return { location: isCurrentSpot ? location : null, isLoading: spot ? isLoading : false, hasError: spot ? hasError : false }
}