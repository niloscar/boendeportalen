import { useState, useEffect, useMemo, useReducer } from 'react';
import { getAvailableApartments } from '../api/apartmentApi.ts';
import type { ApartmentData } from '../types/apartment.ts';
import { getUniqueOptions } from '../utils/apartments.ts';
import { apartmentReducer, apartmentDetails } from '../reducers/apartmentReducer.ts';

export default function useApartmentFilter() {
    const [apartments, setApartments] = useState<ApartmentData[]>([]);
    const [filteredApartments, setFilteredApartments] = useState<ApartmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [filterSettings, setFilterSettings] = useReducer(apartmentReducer, apartmentDetails);
    const setRooms = (value: string[]) => setFilterSettings({ type: 'roomChanged', value })
    const setDistrict = (value: string[]) => setFilterSettings({ type: 'districtChanged', value })
    const setMaxRent = (value: number) => setFilterSettings({ type: 'maxRentChanged', value })
    const setSortBy = (value: string) => setFilterSettings({ type: 'sortByChanged', value })
    const resetFilters = () => setFilterSettings({ type: 'filtersReset' })

    const districtOptions = useMemo(() => getUniqueOptions(apartments, 'district'), [apartments]);
    const roomOptions = useMemo(() => getUniqueOptions(apartments, 'rooms'), [apartments]);

    useEffect(() => {
        const fetchApartments = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getAvailableApartments();
                setApartments(data);
                setFilteredApartments(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchApartments();
    }, []);

    useEffect(() => {
        const filterResults = () => {
            const filterRooms = filterSettings.rooms.length > 0 ? apartments.filter((a) => filterSettings.rooms.some((room) => room === a.rooms)) : apartments;
            const filterRent = filterRooms.filter(a => a.rent < filterSettings.maxRent);
            const filterArea = filterSettings.district.length > 0 ? filterRent.filter((a) => filterSettings.district.some((dr) => dr === a.district)) : filterRent;
            const sortApartmentsList = filterArea;
            sortApartmentsList.sort((a, b) => {
                if (filterSettings.sortBy === 'price-asc') return a.rent - b.rent
                if (filterSettings.sortBy === 'price-desc') return b.rent - a.rent
                if (filterSettings.sortBy === 'date-asc') return new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
                if (filterSettings.sortBy === 'date-desc') return new Date(b.end_date).getTime() - new Date(a.end_date).getTime()

                return a.street.localeCompare(b.street, 'sv-SE')
            })
             setFilteredApartments(sortApartmentsList);
        }
        filterResults();
    }, [filterSettings.maxRent, filterSettings.rooms, filterSettings.district, filterSettings.sortBy, apartments])

    return {
        filteredApartments,
        loading,
        error,
        rooms: filterSettings.rooms,
        maxRent: filterSettings.maxRent,
        district: filterSettings.district,
        districtOptions,
        roomOptions,
        sortBy: filterSettings.sortBy,
        resetFilters,
        setDistrict,
        setRooms,
        setMaxRent,
        setSortBy,
    }

}

