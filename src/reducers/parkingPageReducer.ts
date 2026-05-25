import type { ParkingPageAction, ParkingPageState } from '../types/parking'

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
