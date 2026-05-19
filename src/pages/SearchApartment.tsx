import { useState, useEffect, useMemo } from 'react';
import ApartmentList from '../components/SearchApartmentPage/ApartmentList.tsx';
import ApartmentFilter from '../components/SearchApartmentPage/ApartmentFilter.tsx';
import type { Apartment, Rent, Available, ApartmentData } from "../types/Apartment.ts";
import { getAvailableApartments } from '../api/apartmentApi.ts';

const SearchApartment = () => {
    const [apartments, setApartments] = useState<ApartmentData[]>([
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchApartments = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getAvailableApartments();
            setApartments(data);
        } catch (error: unknown ) {
            if(error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchApartments();
    },[]);

    if(loading) {
        <div>Laddar lägenheter, vänligen vänta</div>
    }
    if(error) {
        <div>Problem med att hämta lägenheter. Vänligen ladda om sidan och försök igen. </div>
    }
    return (
        <div className="flex flex-col items-center gap-6 p-6">
            <h1 className="text-5xl">Lediga lägenheter</h1>
            <ApartmentFilter />
            <ApartmentList apartments={apartments} />
        </div>
    )
}

export default SearchApartment
