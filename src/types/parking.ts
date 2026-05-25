export type ParkingSortOption = 'price-asc' | 'price-desc' | 'date-asc' | 'date-desc' | 'address-asc'

export type ParkingSpot = {
    id: number
    address: string
    city: string
    postalCode: string
    type: string
    price: number
    availableFrom: string
    renter: string | null
    application: boolean
}

export type ParkingFilters = {
    searchQuery: string
    selectedCities: string[]
    selectedTypes: string[]
    sortBy: ParkingSortOption
}

export type ParkingPageState = {
    searchQuery: string
    selectedCities: string[]
    selectedTypes: string[]
    sortBy: ParkingSortOption
    parkingSpots: ParkingSpot[]
    isLoading: boolean
    loadError: string | null
    currentPage: number
    cityOptions: string[]
    typeOptions: string[]
    totalPages: number
    currentSpots: ParkingSpot[]
    spots: ParkingSpot[]
}

export type Props = {
    currentSpots: ParkingSpot[]
    totalPages: number
    currentPage: number
    onPageChange: (page: number) => void
    isLoading: boolean
    loadError: string | null
    hasSpots: boolean
}