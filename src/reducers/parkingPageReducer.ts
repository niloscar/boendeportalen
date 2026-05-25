import type { ParkingSortOption } from '../types/parking'

export type ParkingPageState = {
    searchQuery: string
    selectedCities: string[]
    selectedTypes: string[]
    sortBy: ParkingSortOption
    currentPage: number
}

export type ParkingPageAction = { type: 'searchChanged'; value: string } | { type: 'citiesChanged'; value: string[] } | { type: 'typesChanged'; value: string[] } | { type: 'sortChanged'; value: ParkingSortOption } | { type: 'pageChanged'; value: number } | { type: 'filtersReset' }

export const initialParkingPageState: ParkingPageState = {
    searchQuery: '',
    selectedCities: [],
    selectedTypes: [],
    sortBy: 'price-asc',
    currentPage: 1,
}

export function parkingPageReducer(state: ParkingPageState, action: ParkingPageAction): ParkingPageState {
    switch (action.type) {
        case 'searchChanged':
            return {
                ...state,
                searchQuery: action.value,
                currentPage: 1,
            }
        case 'citiesChanged':
            return {
                ...state,
                selectedCities: action.value,
                currentPage: 1,
            }
        case 'typesChanged':
            return {
                ...state,
                selectedTypes: action.value,
                currentPage: 1,
            }
        case 'sortChanged':
            return {
                ...state,
                sortBy: action.value,
                currentPage: 1,
            }
        case 'pageChanged':
            return {
                ...state,
                currentPage: action.value,
            }
        case 'filtersReset':
            return initialParkingPageState
        default:
            return state
    }
}
