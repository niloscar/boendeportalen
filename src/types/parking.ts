export type ParkingPageState = {
    searchQuery: string
    selectedCities: string[]
    selectedTypes: string[]
    sortBy: ParkingSortOption
    currentPage: number
}

export type ParkingPageAction = { type: 'searchChanged'; value: string } | { type: 'citiesChanged'; value: string[] } | { type: 'typesChanged'; value: string[] } | { type: 'sortChanged'; value: ParkingSortOption } | { type: 'pageChanged'; value: number } | { type: 'filtersReset' }

export type ParkingSortOption = 'price-asc' | 'price-desc' | 'date-asc' | 'date-desc' | 'address-asc'

export type ParkingPageFilters = Pick<ParkingPageState, 'searchQuery' | 'selectedCities' | 'selectedTypes' | 'sortBy'>

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

export type ParkingListProps = {
    currentSpots: ParkingSpot[]
    totalPages: number
    currentPage: number
    onPageChange: (page: number) => void
    isLoading: boolean
    loadError: string | null
    hasSpots: boolean
}