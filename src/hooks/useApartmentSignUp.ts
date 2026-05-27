import { useState, useCallback } from 'react';
import { Temporal } from '@js-temporal/polyfill';
import type { ApartmentProp, SignedUpData } from '../types/apartment.ts';
import { createApartmentSignUp, getApartmentSignupStatus, deleteApartmentSignUp, getAllApartmentSignups } from '../api/apartmentApi.ts';
import { useSession } from './useAuth.ts';

export function useApartmentSignUp({ apartment }: ApartmentProp) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [applied, setApplied] = useState<SignedUpData[]>([]);
    const [totalApplications, setTotalApplications] = useState([]);
    const today = new Date().toJSON().slice(0, 10);
    const activeUntil = apartment && Temporal.PlainDate.from(apartment.end_date).add({ weeks: 2 }).toString();
    const session = useSession();

    const getApartmentStatus = useCallback(async () => {
        if (apartment) {
            try {
                setLoading(true);
                setError('');
                const data = await getApartmentSignupStatus(session?.access_token, apartment.id, activeUntil);
                setApplied(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }
    }, [loading, session, apartment, activeUntil]);


    const getAllApartmentStatus = useCallback(async () => {
        if (apartment) {
            try {
                setLoading(true);
                setError('');
                const data = await getAllApartmentSignups(session?.access_token, today);
                setTotalApplications(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }
    }, [session, apartment, today]);

    const signUp = async () => {
        if (apartment) {
            try {
                setLoading(true);
                setError('');
                await createApartmentSignUp(session?.access_token, apartment.id, activeUntil);
                getApartmentStatus();
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
                await deleteApartmentSignUp(session?.access_token, applied[0].id);
                getApartmentStatus();
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
        getApartmentStatus,
        getAllApartmentStatus,
        loading,
        error,
        applied,
        totalApplications
    };
}
