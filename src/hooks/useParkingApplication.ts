import { useEffect, useState } from 'react'
import { createParkingApplication, deleteParkingApplication, fetchParkingApplicationByUserAndParking } from '../api/parking'
import type { UseParkingApplicationParams } from '../types/parking'

export default function useParkingApplication({ parkingId, userId }: UseParkingApplicationParams) {
    const [hasApplied, setHasApplied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const hasContext = Boolean(parkingId && userId)

    // Checks if the user has already applied on mount. Changes `isActive` accordingly.
    useEffect(() => {
        if (!hasContext || !parkingId || !userId) return

        let isActive = true

        const loadApplicationStatus = async () => {
            try {
                setHasApplied(false)
                setIsLoading(true)
                setError(null)

                const existingApplication = await fetchParkingApplicationByUserAndParking(parkingId, userId)

                if (isActive) {
                    setHasApplied(Boolean(existingApplication))
                }
            } catch (loadError) {
                if (isActive) {
                    setError('Kunde inte kontrollera om du redan har ansökt.')
                }
                console.error('Fel vid hämtning av ansökningsstatus:', loadError)
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        void loadApplicationStatus()

        return () => {
            isActive = false
        }
    }, [hasContext, parkingId, userId])

    // Handles applying. Checking if user already applied and stops them. On success, sets `hasApplied` to true and creates a parking application in the database.
    const apply = async () => {
        if (!parkingId || !userId) return

        try {
            setIsSubmitting(true)
            setError(null)

            const existingApplication = await fetchParkingApplicationByUserAndParking(parkingId, userId)

            if (existingApplication) {
                setHasApplied(true)
                return
            }

            await createParkingApplication(parkingId, userId)
            setHasApplied(true)
        } catch (applyError) {
            const maybeError = applyError as { code?: string }

            if (maybeError.code === '23505') {
                setHasApplied(true)
            } else {
                setError('Kunde inte skicka ansökan just nu. Försök igen om en stund.')
            }

            console.error('Fel vid skapande av ansökan:', applyError)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handles removing an application. Deletes from database and sets `hasApplied` to false.
    const removeApplication = async () => {
        if (!parkingId || !userId) return

        try {
            setIsSubmitting(true)
            setError(null)

            await deleteParkingApplication(parkingId, userId)
            setHasApplied(false)
        } catch (removeError) {
            setError('Kunde inte ta bort ansökan just nu. Försök igen om en stund.')
            console.error('Fel vid borttagning av ansökan:', removeError)
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        hasApplied: hasContext ? hasApplied : false,
        isLoading: hasContext ? isLoading : false,
        isSubmitting: hasContext ? isSubmitting : false,
        error: hasContext ? error : null,
        apply,
        removeApplication,
        refreshApplicationStatus: () => {
            if (parkingId && userId) {
                void fetchParkingApplicationByUserAndParking(parkingId, userId).then((existingApplication) => {
                    setHasApplied(Boolean(existingApplication))
                })
            }
        },
    }
}