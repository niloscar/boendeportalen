import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon, MapPinIcon, CalendarDotsIcon, CurrencyCircleDollarIcon, CarProfileIcon, EnvelopeIcon, LinkIcon } from '@phosphor-icons/react'
import { fetchParkingSpotById } from '../api/parking'
import Button from '../components/ui/Button'
import LeafletMap from '../components/map/LeafletMap.tsx'
import { lightGrayMapPreset } from '../components/map/mapPresets'
import { useAuthContext } from '../contexts/useAuthContext'
import useParkingApplication from '../hooks/useParkingApplication'
import useParkingLocation from '../hooks/useParkingLocation'
import { formatNumber } from '../utils/calc'
import type { ParkingSpot } from '../types/parking'

export default function ParkingDetails() {
    const { parkingId } = useParams()
    const navigate = useNavigate()
    const { user, loading: authLoading } = useAuthContext()
    const [spot, setSpot] = useState<ParkingSpot | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<boolean>(false)
    const { hasApplied, isLoading: applicationLoading, isSubmitting: applicationSubmitting, error: applicationError, apply: handleApply, removeApplication: handleRemoveApplication } = useParkingApplication({ parkingId: spot?.id, userId: user?.id })
    const { location: mapLocation, isLoading: mapLoading, hasError: mapError } = useParkingLocation(spot)

    const handleApplicationClick = async () => {
        if (!spot || !user) {
            navigate('/inloggning')
            return
        }

        if (hasApplied) {
            await handleRemoveApplication()
            return
        }

        await handleApply()
    }

    useEffect(() => {
        let isActive = true

        const loadSpot = async () => {
            if (!parkingId || Number.isNaN(Number(parkingId))) {
                setLoadError(true)
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                setLoadError(false)
                const parkingSpot = await fetchParkingSpotById(Number(parkingId))
                if (isActive) setSpot(parkingSpot)
            } catch (error) {
                if (isActive) setLoadError(true)
                console.error('Fel vid hämtning av parkeringsplats:', error)
            } finally {
                if (isActive) setIsLoading(false)
            }
        }

        loadSpot()

        return () => {
            isActive = false
        }
    }, [parkingId])

    if (isLoading) return <div className="w-full text-center text-gray-600">Laddar parkeringsplats...</div>

    if (loadError || !spot) {
        return (
            <div className="mx-auto h-max w-max flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-md text-center justify-center items-center">
                <h1 className="text-3xl font-bold">Parkeringsplats</h1>
                <p className="text-gray-600">Det verkar som att ett problem har uppstått. Parkeringsplatsen kunde ej hämtas. <br />Är du säker på att du angett rätt ID?</p>
                <div className="flex flex-wrap gap-3">
                    <Button onClick={() => navigate('/parkeringar')} variant="secondary">Tillbaka till parkeringar</Button>
                    <Button onClick={() => navigate('/')} variant="primary">Gå till startsidan</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto flex w-full flex-col gap-8 px-4 md:px-0">
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                <Link to="/parkeringar" className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 transition hover:border-neutral-400 hover:text-neutral-900"><ArrowLeftIcon className="h-4 w-4" /> Tillbaka</Link>
                <Link to="/parkeringar" className="py-2 text-green-500 hover:text-green-600">Parkeringar</Link>
                <span>/</span>
                <span className="text-neutral-900">{spot.address}</span>
            </div>

            <section className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
                <article className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
                    <img src={spot.imageUrl} alt={`${spot.type} vid ${spot.address}`} className="h-72 w-full object-cover" />

                    <div className="flex flex-col gap-6 p-6 md:p-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold md:text-5xl">{spot.address}</h1>
                            <p className="text-lg text-neutral-600">{spot.city}, {spot.postalCode}</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-neutral-100 p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-600"><CarProfileIcon className="h-4 w-4" /> Typ</div>
                                <p className="text-lg font-semibold">{spot.type}</p>
                            </div>
                            <div className="rounded-2xl bg-neutral-100 p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-600"><CurrencyCircleDollarIcon className="h-4 w-4" /> Hyra</div>
                                <p className="text-lg font-semibold">{formatNumber(spot.price)} kr/mån</p>
                            </div>
                            <div className="rounded-2xl bg-neutral-100 p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-600"><CalendarDotsIcon className="h-4 w-4" /> Ledig från</div>
                                <p className="text-lg font-semibold">{new Date(spot.availableFrom).toLocaleDateString('sv-SE')}</p>
                            </div>
                            <div className="rounded-2xl bg-neutral-100 p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-600"><MapPinIcon className="h-4 w-4" /> Status</div>
                                <p className="text-lg font-semibold">{spot.application ? 'Öppen ansökan' : 'Stängd ansökan'}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-neutral-100 p-4 text-neutral-700">
                            <p className="font-medium text-neutral-900">Information</p>
                            <p className="mt-2">{spot.description ?? 'Ingen beskrivning är angiven för denna parkeringsplats ännu.'}</p>
                        </div>
                    </div>
                </article>

                <aside className="flex h-full flex-col gap-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-md">
                    {authLoading ? (
                        <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-neutral-100 p-4 text-neutral-600">
                            <h2 className="text-2xl font-bold text-neutral-900">Kontrollerar inloggning...</h2>
                            <p>Vänta ett ögonblick medan vi läser din session.</p>
                        </div>
                    ) : !user ? (
                        <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-neutral-100 p-4">
                            <h2 className="text-2xl font-bold">Du är ej inloggad!</h2>
                            <p className="text-neutral-600">För att kunna ansöka om en parkeringsplats på <strong>BoendePortalen</strong> så behöver du vara inloggad. Klicka på knappen nedan för att logga in eller skapa ett konto.</p>
                            <Button onClick={() => navigate('/inloggning')} variant="primary" className="flex items-center justify-center gap-2">
                                <LinkIcon className="h-5 w-5" /> Logga in / Skapa konto
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-neutral-100 p-4">
                            <h2 className="text-2xl font-bold">Är du intresserad?</h2>
                            {hasApplied ? (
                                <p className="text-neutral-600">Du har redan ansökt om denna parkeringsplats. Du kan ångra din ansökan nedan om du vill ansöka igen senare.</p>
                            ) : (
                                <p className="text-neutral-600">Klicka på knappen nedan för att ansöka om denna parkeringsplats. När din ansökan är godkänd kommer du att kontaktas av <strong>BoendePortalen</strong>.</p>
                            )}

                            <Button
                                onClick={handleApplicationClick}
                                variant="primary"
                                disabled={applicationLoading || applicationSubmitting}
                                className="flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <EnvelopeIcon className="h-5 w-5" />
                                {applicationLoading ? 'Kontrollerar ansökan...' : applicationSubmitting ? hasApplied ? 'Tar bort ansökan...' : 'Skickar ansökan...' : hasApplied ? 'Ångra ansökan' : 'Ansök om parkeringsplats'}
                            </Button>

                            {applicationError && <p className="text-sm text-red-600">{applicationError}</p>}
                        </div>
                    )}

                    <div className="flex flex-1 min-h-0 flex-col gap-4 rounded-2xl border border-neutral-200 bg-neutral-100 p-4">
                        <h2 className="text-2xl font-bold">Var finns platsen?</h2>
                        <p className="text-neutral-600">Kartvyn visar var parkeringsplatsen finns.</p>

                        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
                            {mapLocation ? (
                                <LeafletMap location={mapLocation} {...lightGrayMapPreset} />
                            ) : mapLoading ? (
                                <div className="flex h-72 items-center justify-center p-4 text-center text-neutral-600">Laddar karta...</div>
                            ) : (
                                <div className="flex h-72 items-center justify-center p-4 text-center text-neutral-600">{mapError ? 'Kunde inte hitta platsen på kartan.' : 'Laddar karta...'}</div>
                            )}
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    )
}
