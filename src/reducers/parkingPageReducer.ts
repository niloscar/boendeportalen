import type { ParkingPageAction, ParkingPageState } from '../types/parking'

export const initialParkingPageState: ParkingPageState = {
    searchQuery: '',
    selectedCities: [],
    selectedTypes: [],
    sortBy: 'price-asc',
    currentPage: 1,
}

export function parkingPageReducer(state: ParkingPageState, action: ParkingPageAction): ParkingPageState {
    let update: Partial<ParkingPageState> | null

    switch (action.type) {
        case 'searchChanged':
            update = { searchQuery: action.value }
            break
        case 'citiesChanged':
            update = { selectedCities: action.value }
            break
        case 'typesChanged':
            update = { selectedTypes: action.value }
            break
        case 'sortChanged':
            update = { sortBy: action.value }
            break
        case 'pageChanged':
            return { ...state, currentPage: action.value }
        case 'filtersReset':
            return initialParkingPageState
        default:
            return state
    }

    if (update) return { ...state, ...update, currentPage: 1 }

    return state
}
