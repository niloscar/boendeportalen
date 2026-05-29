import { useState, useEffect } from 'react';
import { Temporal } from '@js-temporal/polyfill';
import type { ApartmentProp, SignedUpData } from '../types/apartment.ts';
import { createApartmentSignUp, getApartmentSignupStatus, deleteApartmentSignUp, getAllApartmentSignups } from '../api/apartmentApi.ts';

export function useApartmentSignUp({ apartment }: ApartmentProp) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [errorStatus, setErrorStatus] = useState('');
    const [loadingSignUp, setLoadingSignUp] = useState(false);
    const [errorSignUp, setErrorSignUp] = useState('');
    const [loadingRemove, setLoadingRemove] = useState(false);
    const [errorRemove, setErrorRemove] = useState('');
    const [applied, setApplied] = useState<SignedUpData[]>([]);
    const [totalApplications, setTotalApplications] = useState([]);
    const [updated, setUpdated] = useState(false);
    const today = new Date().toJSON().slice(0, 10);
    const activeUntil = apartment && apartment.end_date && Temporal.PlainDate.from(apartment.end_date).add({ weeks: 2 }).toString();

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
                    setLoadingStatus(true);
                    setErrorStatus('');
                    const data = await getAllApartmentSignups(today);
                    setTotalApplications(data);
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        setErrorStatus(error.message);
                    }
                } finally {
                    setLoadingStatus(false);
                }
            }
        }
        getAllApartmentStatus();
    }, [apartment, today, updated])
    const signUp = async () => {
        if (apartment) {
            try {
                setLoadingSignUp(true);
                setErrorSignUp('');
                await createApartmentSignUp(apartment.id, activeUntil);
                setUpdated(!updated);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setErrorSignUp(error.message);
                }
            } finally {
                setLoadingSignUp(false);
            }
        }
    }

    const deleteSignUp = async () => {
        if (apartment) {
            try {
                setLoadingRemove(true);
                setErrorRemove('');
                await deleteApartmentSignUp(applied[0].id);
                setUpdated(!updated)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setErrorRemove(error.message);
                }
            } finally {
                setLoadingRemove(false);
            }
        }
    }

    return {
        signUp,
        deleteSignUp,
        loading,
        error,
        loadingStatus,
        errorStatus,
        loadingSignUp,
        errorSignUp,
        loadingRemove,
        errorRemove,
        applied,
        totalApplications
    };
}
