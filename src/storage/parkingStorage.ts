import type { ParkingPageFilters, ParkingPageState } from '../types/parking'

const parkingPageStorageKey = 'parking-page-filters'
const defaultParkingPageFilters: ParkingPageFilters = { searchQuery: '', selectedCities: [], selectedTypes: [], sortBy: 'price-asc' }

const isParkingPageFilters = (value: unknown): value is ParkingPageFilters => {
    if (!value || typeof value !== 'object') return false

    const candidate = value as Partial<ParkingPageFilters>

    return typeof candidate.searchQuery === 'string' && Array.isArray(candidate.selectedCities) && Array.isArray(candidate.selectedTypes) && typeof candidate.sortBy === 'string'
}

export const readParkingPageState = (): ParkingPageState => {
    if (typeof window === 'undefined') return { ...defaultParkingPageFilters, currentPage: 1 }

    const rawValue = window.localStorage.getItem(parkingPageStorageKey)
    if (!rawValue) return { ...defaultParkingPageFilters, currentPage: 1 }

    try {
        const parsedValue = JSON.parse(rawValue) as unknown
        if (!isParkingPageFilters(parsedValue)) return { ...defaultParkingPageFilters, currentPage: 1 }

        return { ...defaultParkingPageFilters, ...parsedValue, currentPage: 1 }
    } catch {
        return { ...defaultParkingPageFilters, currentPage: 1 }
    }
}

export const saveParkingPageState = (state: ParkingPageState) => {
    if (typeof window === 'undefined') return

    const filters: ParkingPageFilters = { searchQuery: state.searchQuery, selectedCities: state.selectedCities, selectedTypes: state.selectedTypes, sortBy: state.sortBy }

    window.localStorage.setItem(parkingPageStorageKey, JSON.stringify(filters))
}
