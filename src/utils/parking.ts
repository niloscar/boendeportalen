import type { ParkingSortOption, ParkingSpot } from '../types/parking'

export const itemsPerPage = 9
export const getUniqueOptions = (spots: ParkingSpot[], key: 'city' | 'type') => Array.from(new Set(spots.map((spot) => spot[key]))).sort((a, b) => a.localeCompare(b, 'sv-SE'))

export const filterParkingSpots = (spots: ParkingSpot[], searchQuery: string, selectedCities: string[], selectedTypes: string[]) => {
    const query = searchQuery.trim().toLowerCase()

    return spots.filter((spot) => {
        const matchesQuery = !query || spot.address.toLowerCase().includes(query) || spot.city.toLowerCase().includes(query) || spot.postalCode.toLowerCase().includes(query) || spot.type.toLowerCase().includes(query)
        const matchesCity = selectedCities.length === 0 || selectedCities.includes(spot.city)
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(spot.type)

        return matchesQuery && matchesCity && matchesType
    })
}

export const sortParkingSpots = (spots: ParkingSpot[], sortBy: ParkingSortOption) => {
    const sortedSpots = [...spots]

    sortedSpots.sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        if (sortBy === 'date-asc') return new Date(a.availableFrom).getTime() - new Date(b.availableFrom).getTime()
        if (sortBy === 'date-desc') return new Date(b.availableFrom).getTime() - new Date(a.availableFrom).getTime()

        return a.address.localeCompare(b.address, 'sv-SE')
    })

    return sortedSpots
}

export const paginateParkingSpots = (spots: ParkingSpot[], currentPage: number) => {
    const totalPages = Math.max(1, Math.ceil(spots.length / itemsPerPage))
    const safeCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (safeCurrentPage - 1) * itemsPerPage

    return { totalPages, safeCurrentPage, currentSpots: spots.slice(startIndex, startIndex + itemsPerPage) }
}
