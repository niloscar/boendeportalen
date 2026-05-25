import ParkingCard from '../components/parking/ParkingCard'
import FilterBar from '../components/ui/FilterBar'
import Pagination from '../components/ui/Pagination'
import { fetchParkingSpots } from '../api/parking'
import { useEffect, useState } from 'react'
import type { ParkingSortOption, ParkingSpot } from '../types/parking'

export default function Parking() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCities, setSelectedCities] = useState<string[]>([])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const [sortBy, setSortBy] = useState<ParkingSortOption>('price-asc')
    const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        const loadParkingSpots = async () => {
            setIsLoading(true)
            setLoadError(null)

            try {
                const { data } = await fetchParkingSpots({ application: 'Open' })

                if (isMounted) {
                    setParkingSpots(data)
                }
            } catch (error) {
                if (isMounted) {
                    setLoadError('Kunde inte hämta parkeringsplatser från databasen.')
                }
                console.error('Fel vid hämtning av parkeringsplatser:', error)
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadParkingSpots()

        return () => {
            isMounted = false
        }
    }, [])

    const baseSpots = parkingSpots
    const cityOptions = Array.from(new Set(baseSpots.map((spot) => spot.city))).sort((a, b) => a.localeCompare(b, 'sv-SE'))
    const typeOptions = Array.from(new Set(baseSpots.map((spot) => spot.type))).sort((a, b) => a.localeCompare(b, 'sv-SE'))

    const filteredSpots = baseSpots.filter((spot) => {
        const query = searchQuery.trim().toLowerCase()
        const matchesQuery = !query
            || spot.address.toLowerCase().includes(query)
            || spot.city.toLowerCase().includes(query)
            || spot.postalCode.toLowerCase().includes(query)
            || spot.type.toLowerCase().includes(query)

        const matchesCity = selectedCities.length === 0 || selectedCities.includes(spot.city)
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(spot.type)

        return matchesQuery && matchesCity && matchesType
    })

    const spots = [...filteredSpots].sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        if (sortBy === 'date-asc') return new Date(a.availableFrom).getTime() - new Date(b.availableFrom).getTime()
        if (sortBy === 'date-desc') return new Date(b.availableFrom).getTime() - new Date(a.availableFrom).getTime()

        return a.address.localeCompare(b.address, 'sv-SE')
    })

    const itemsPerPage = 8
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.max(1, Math.ceil(spots.length / itemsPerPage))

    const safeCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (safeCurrentPage - 1) * itemsPerPage
    const currentSpots = spots.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className="flex flex-col items-center gap-6 p-6 w-full max-w-5xl">
            <h1 className="text-3xl md:text-5xl font-bold">Lediga parkeringsplatser</h1>
            <p className="text-gray-600">Här hittar du lediga parkeringsplatser i din närhet.</p>

            {isLoading && <p className="text-gray-600">Laddar parkeringsplatser...</p>}
            {loadError && <p className="text-red-600">{loadError}</p>}

            <FilterBar
                searchQuery={searchQuery}
                selectedCities={selectedCities}
                selectedTypes={selectedTypes}
                sortBy={sortBy}
                cityOptions={cityOptions}
                typeOptions={typeOptions}
                onSearchChange={(value) => {
                    setSearchQuery(value)
                    setCurrentPage(1)
                }}
                onCityChange={(values) => {
                    setSelectedCities(values)
                    setCurrentPage(1)
                }}
                onTypeChange={(values) => {
                    setSelectedTypes(values)
                    setCurrentPage(1)
                }}
                onSortChange={(value) => {
                    setSortBy(value)
                    setCurrentPage(1)
                }}
                onClear={() => {
                    setSearchQuery('')
                    setSelectedCities([])
                    setSelectedTypes([])
                    setSortBy('price-asc')
                    setCurrentPage(1)
                }}
            />

            {!isLoading && !loadError && spots.length === 0 ? (
                <p className="text-gray-600">Inga parkeringsplatser matchar dina filter.</p>
            ) : (
                !isLoading && !loadError && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                            {currentSpots.map(spot => (
                                <ParkingCard key={spot.id} spot={spot} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <Pagination
                                totalPages={totalPages}
                                currentPage={safeCurrentPage}
                                onPageChange={(page) => setCurrentPage(Math.min(page, totalPages))}
                            />
                        )}
                    </>
                )
            )}
        </div>
    );
}