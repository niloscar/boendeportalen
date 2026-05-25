import { useEffect, useMemo, useReducer, useState } from 'react'
import { fetchParkingSpots } from '../api/parking'
import type { ParkingSpot } from '../types/parking'
import { filterParkingSpots, getUniqueOptions, paginateParkingSpots, sortParkingSpots } from '../utils/parking'
import { parkingPageReducer } from '../reducers/parkingPageReducer'
import { readParkingPageState, saveParkingPageState } from '../storage/parkingStorage'

export default function useParkingPage() {
    const [pageState, dispatch] = useReducer(parkingPageReducer, undefined, readParkingPageState)
    const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        saveParkingPageState(pageState)
    }, [pageState])

    useEffect(() => {
        let isActive = true

        const loadParkingSpots = async () => {
            setIsLoading(true)
            setLoadError(null)

            try {
                const { data } = await fetchParkingSpots({ application: true })

                if (isActive) {
                    setParkingSpots(data)
                }
            } catch (error) {
                if (isActive) {
                    setLoadError('Kunde inte hämta parkeringsplatser från databasen.')
                }
                console.error('Fel vid hämtning av parkeringsplatser:', error)
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        loadParkingSpots()

        return () => {
            isActive = false
        }
    }, [])

    const filteredSpots = useMemo(() => filterParkingSpots(parkingSpots, pageState.searchQuery, pageState.selectedCities, pageState.selectedTypes), [parkingSpots, pageState.searchQuery, pageState.selectedCities, pageState.selectedTypes])
    const sortedSpots = useMemo(() => sortParkingSpots(filteredSpots, pageState.sortBy), [filteredSpots, pageState.sortBy])
    const { totalPages, safeCurrentPage, currentSpots } = paginateParkingSpots(sortedSpots, pageState.currentPage)
    const cityOptions = useMemo(() => getUniqueOptions(parkingSpots, 'city'), [parkingSpots])
    const typeOptions = useMemo(() => getUniqueOptions(parkingSpots, 'type'), [parkingSpots])
    const resetFilters = () => dispatch({ type: 'filtersReset' })

    const setSearchQuery = (value: string) => dispatch({ type: 'searchChanged', value })
    const setSelectedCities = (value: string[]) => dispatch({ type: 'citiesChanged', value })
    const setSelectedTypes = (value: string[]) => dispatch({ type: 'typesChanged', value })
    const setSortBy = (value: typeof pageState.sortBy) => dispatch({ type: 'sortChanged', value })
    const setCurrentPage = (value: number) => dispatch({ type: 'pageChanged', value })

    return {
        searchQuery: pageState.searchQuery,
        setSearchQuery,
        selectedCities: pageState.selectedCities,
        setSelectedCities,
        selectedTypes: pageState.selectedTypes,
        setSelectedTypes,
        sortBy: pageState.sortBy,
        setSortBy,
        parkingSpots,
        isLoading,
        loadError,
        currentPage: safeCurrentPage,
        setCurrentPage,
        cityOptions,
        typeOptions,
        totalPages,
        currentSpots,
        spots: sortedSpots,
        resetFilters,
    }
}
