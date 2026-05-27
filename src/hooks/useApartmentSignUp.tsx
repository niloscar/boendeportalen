import { useState, useEffect } from 'react';
import { Temporal } from "@js-temporal/polyfill";
import type { ApartmentProp, SignedUpData } from '../types/apartment.ts';
import { createApartmentSignUp, getApartmentSignupStatus, deleteApartmentSignUp } from '../api/apartmentApi.ts';

export function useApartmentSignUp({ apartment }: ApartmentProp) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [applied, setApplied] = useState<SignedUpData[]>([]);
    const activeUntil = apartment && Temporal.PlainDate.from(apartment.end_date).add({ weeks: 2 }).toString();
    
    useEffect(() => {
        const getApartmentStatus = async () => {
        if (loading) return;
        if (apartment) {
            try {
                setLoading(true);
                setError('');
                const data = await getApartmentSignupStatus(apartment.id, activeUntil);
                setApplied(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }
    }
    
    getApartmentStatus();
    },[])
    const signUp = async () => {
        if (loading) return;
        if (apartment) {
            try {
                setLoading(true);
                setError('');
                await createApartmentSignUp(apartment.id, activeUntil);
                const data = await getApartmentSignupStatus(apartment.id, activeUntil);
                setApplied(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }
    }

    const deleteSignUp = async () => {
        if (loading) return;
        if (apartment) {
            try {
                setLoading(true);
                setError('');
                await deleteApartmentSignUp(applied[0].id);
                const data = await getApartmentSignupStatus(apartment.id, activeUntil);
                setApplied(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }
    }

    return {
        signUp,
        deleteSignUp,
        loading,
        error,
        applied,
    };
}
