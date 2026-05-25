import { useState, useCallback } from 'react';
import { Temporal } from "@js-temporal/polyfill";
import type { ApartmentProp, SignedUpData } from '../types/apartment.ts';
import { createApartmentSignUp, getApartmentSignupStatus, deleteApartmentSignUp } from '../api/apartmentApi.ts';
import { useSession } from './useAuth.ts';

export function useSignUp({ apartment }: ApartmentProp) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(0);
    const [applied, setApplied] = useState<SignedUpData[]>([]);
    const [deleted, setDeleted] = useState(0);
    const activeUntil = Temporal.PlainDate.from(apartment.end_date).add({ weeks: 2 }).toString();
    const session = useSession();

    const signUp = useCallback(async () => {
        if (loading) return;
        try {
            setLoading(true);
            setError('');
            const data = await createApartmentSignUp(session?.access_token, apartment.id, activeUntil);
            setSaved(data);
            getApartmentStatus();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }, [loading, session?.access_token, apartment.id, activeUntil])

    const deleteSignUp = useCallback(async () => {
        if (loading) return;
        try {
            setLoading(true);
            setError('');
            const data = await deleteApartmentSignUp(session?.access_token, applied[0].id);
            setDeleted(data.status);
            getApartmentStatus();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }, [loading, session?.access_token, applied])

    const getApartmentStatus = useCallback(async () => {
        if (loading) return;
        try {
            setLoading(true);
            setError('');
            const data = await getApartmentSignupStatus(session?.access_token, apartment.id, activeUntil);
            console.log("fetch apatrt");
            setApplied(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }, [loading, session?.access_token, apartment.id, activeUntil]);

    return {
        signUp,
        deleteSignUp,
        getApartmentStatus,
        loading,
        error,
        applied,
    };
}
