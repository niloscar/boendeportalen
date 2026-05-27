import { useState, useEffect, useMemo } from 'react';
import { getAvailableApartments } from '../api/apartmentApi.ts';
import type { ApartmentData } from '../types/apartment.ts';
import { getUniqueOptions } from '../utils/apartments.ts';

export default function useApartmentFilter() {
    const [apartments, setApartments] = useState<ApartmentData[]>([]);
    const [filteredApartments, setFilteredApartments] = useState<ApartmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rooms, setRooms] = useState<string[]>([]);
    const [maxRent, setMaxRent] = useState(20000);
    const [district, setDistrict] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('price-asc');

    const districtOptions = useMemo(() => getUniqueOptions(apartments, 'district'), [apartments])
    const roomOptions = useMemo(() => getUniqueOptions(apartments, 'rooms'), [apartments])

    const resetFilters = () => {
        setDistrict([]);
        setRooms([]);
        setMaxRent(20000);
    }

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
            const filterRooms = rooms.length > 0 ? apartments.filter((a) => rooms.some((room) => room === a.rooms)) : apartments;
            const filterRent = filterRooms.filter(a => a.rent < maxRent);
            const filterArea = district.length > 0 ? filterRent.filter((a) => district.some((dr) => dr === a.district)) : filterRent;
            setFilteredApartments(filterArea);
        }

        filterResults();
    }, [maxRent, rooms, district])

    useEffect(() => {
        const sortApartments = () => {
            const sortApartmentsList = [...filteredApartments];

            sortApartmentsList.sort((a, b) => {
                if (sortBy === 'price-asc') return a.rent - b.rent
                if (sortBy === 'price-desc') return b.rent - a.rent
                if (sortBy === 'date-asc') return new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
                if (sortBy === 'date-desc') return new Date(b.end_date).getTime() - new Date(a.end_date).getTime()

                return a.street.localeCompare(b.street, 'sv-SE')
            })
            setFilteredApartments(sortApartmentsList);
        }
        sortApartments();

    }, [sortBy]);

    return {
        filteredApartments,
        loading,
        error,
        rooms,
        maxRent,
        district,
        districtOptions,
        roomOptions,
        sortBy,
        resetFilters,
        setDistrict,
        setRooms,
        setMaxRent,
        setSortBy
    }

}

