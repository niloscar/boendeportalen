import type { MapLocation } from "./map"

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
    imageUrl: string
    description: string | null
}

export type ParkingApplication = {
    id: string
    signUpDate: string
    parkingId: number
    userId: string
}

export type UseParkingApplicationParams = {
    parkingId: number | null | undefined
    userId: string | null | undefined
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

export type FilterProps = {
    searchQuery: string
    selectedCities: string[]
    selectedTypes: string[]
    sortBy: ParkingSortOption
    cityOptions: string[]
    typeOptions: string[]
    onSearchChange: (value: string) => void
    onCityChange: (values: string[]) => void
    onTypeChange: (values: string[]) => void
    onSortChange: (value: ParkingSortOption) => void
    onClear: () => void
}

export type ParkingSpotRow = {
    id: number
    address: string
    city: string
    postal_code: string
    spot_type: string
    price: number
    available_from: string
    renter: string | null
    application: boolean
    image_url: string
    description: string | null
    created_at: string
    updated_at: string
}

export type ParkingSpotInsert = {
    address: string
    city: string
    postal_code: string
    spot_type: string
    price: number
    available_from: string
    renter?: string | null
    application?: boolean
    image_url?: string
    description?: string | null
}

export type ParkingSpotUpdate = Partial<ParkingSpotInsert>

export type ParkingSpotFilters = {
    searchQuery?: string
    cities?: string[]
    types?: string[]
    application?: boolean
    sortBy?: ParkingSortOption
    limit?: number
    offset?: number
}

export type ParkingSpotInput = {
    address: string
    city: string
    postalCode: string
    type: string
    price: number
    availableFrom: string
    renter?: string | null
    application?: boolean
    imageUrl?: string
    description?: string | null
}

export type ParkingApplicationRow = {
    id: string
    sign_up_date: string
    parking_id: number
    user_id: string
}

export type UseParkingLocationResult = {
    location: MapLocation | null
    isLoading: boolean
    hasError: boolean
}