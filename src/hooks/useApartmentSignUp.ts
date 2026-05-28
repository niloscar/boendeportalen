import { useState, useEffect } from 'react';
import { Temporal } from '@js-temporal/polyfill';
import type { ApartmentProp, SignedUpData } from '../types/apartment.ts';
import { createApartmentSignUp, getApartmentSignupStatus, deleteApartmentSignUp, getAllApartmentSignups } from '../api/apartmentApi.ts';

export function useApartmentSignUp({ apartment }: ApartmentProp) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [applied, setApplied] = useState<SignedUpData[]>([]);
    const [totalApplications, setTotalApplications] = useState([]);
    const [updated, setUpdated] = useState(false);
    const today = new Date().toJSON().slice(0, 10);
    const activeUntil = apartment && Temporal.PlainDate.from(apartment.end_date).add({ weeks: 2 }).toString();

    useEffect(() => {
        const getApartmentStatus = async () => {
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
    }, [apartment, activeUntil, updated])

    useEffect(() => {
        const getAllApartmentStatus = async () => {
            if (apartment) {
                try {
                    setLoading(true);
                    setError('');
                    const data = await getAllApartmentSignups(today);
                    setTotalApplications(data);
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        setError(error.message);
                    }
                } finally {
                    setLoading(false);
                }
            }
        }
        getAllApartmentStatus();
    }, [apartment, today, updated])
    const signUp = async () => {
        if (apartment) {
            try {
                setLoading(true);
                setError('');
                await createApartmentSignUp(apartment.id, activeUntil);
                setUpdated(!updated);
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
        if (apartment) {
            try {
                setLoading(true);
                setError('');
                await deleteApartmentSignUp(applied[0].id);
                setUpdated(!updated)
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
        totalApplications
    };
}
