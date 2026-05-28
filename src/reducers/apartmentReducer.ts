import type { reducerState, reducerAction } from '../types/apartment.js'

export const apartmentDetails = {
    district: [],
    rooms: [],
    maxRent: 20000,
    sortBy: 'price-asc',
}

export function apartmentReducer(state: reducerState, action: reducerAction) {
    let update;

    switch (action.type) {
        case 'districtChanged':
            update = { district: action.value }
            break
        case 'roomChanged':
            update = { rooms: action.value }
            break
        case 'maxRentChanged':
            update = { maxRent: action.value }
            break
        case 'sortByChanged':
            update = { sortBy: action.value }
            break
        case 'filtersReset':
            return apartmentDetails
        default:
            return state
    }

    if (update) return { ...state, ...update }
    return state
}