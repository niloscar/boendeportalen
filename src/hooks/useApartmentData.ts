import type { ApartmentData } from "../types/apartment.ts";
import { getAvailableApartment } from '../api/apartmentApi.ts';
import { useState, useEffect } from "react";

export function useApartmentData(apartmentId: number | undefined) {
    const [apartment, setApartment] = useState<ApartmentData | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
    const fetchApartments = async () => {
        try {
            const data = await getAvailableApartment(apartmentId);
            setApartment(data)
        } catch (error: unknown) {
            if (error instanceof Error) {
               setError(error.message)
            }
        }
    }
    fetchApartments();
    }, [apartmentId])
    return {
        apartment
    }
}