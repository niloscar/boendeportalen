
import { useState, useEffect } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react'
import ImageCarousel from '../components/searchapartment/ImageCarousel.tsx';
import Button from '../components/ui/Button.tsx';
import ApartmentList from '../components/searchapartment/ApartmentList.tsx';
import type { ApartmentData, Detail } from '../types/apartment.ts';
import ApartmentSignUp from '../components/searchapartment/ApartmentSignUp.tsx';
import { useApartmentSignUp } from '../hooks/useApartmentSignUp.ts';
import { useSession } from '../hooks/useAuth.ts';
import { getDetails, fetchApartments } from '../utils/apartments.ts'
import Skeleton from '@mui/material/Skeleton';


const Apartment = () => {
    const { state } = useLocation();
    const session = useSession();
    const { apartmentId } = useParams();
    const [apartment, setApartment] = useState<ApartmentData | null>(
        state?.apartment ?? null
    );
    const [details, setDetails] = useState<Detail[] | null>(
        state?.details ?? null
    );
    const [apartmentLoading, setApartementLoading] = useState(false);
    const [apartmentError, setApartmentError] = useState('');
    const finalDayToApply = details && details.find(d => d.title == 'Sista ansökningsdag');
    const finalDateToApply = finalDayToApply && new Date(finalDayToApply.content);
    useEffect(() => {
        if (apartmentLoading) return;
        if (!state?.apartment && apartmentId) {
            const loadApartment = async () => {
                try {
                    setApartmentError('');
                    setApartementLoading(true);
                    const data = await fetchApartments(apartmentId);
                    if (data) {
                        setApartment(data);
                        setDetails(getDetails(data));
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        setApartmentError(error.message);
                    }
                } finally {
                    setApartementLoading(false);
                }
            };

            loadApartment();
        }
    }, [state?.apartment, apartmentId]);

    const {
        signUp,
        deleteSignUp,
        loading,
        error,
        applied,
        totalApplications
    } = useApartmentSignUp({ apartment });

    if (!apartment || !details || apartmentError != '') {
        return (
            <section className="flex flex-col items-center gap-6 p-6 w-full">
                <p>Kunde inte hämta information om lägenheten. Vänligen gå tillbaka och försök igen.</p>
                <Link to="/bostader">
                    <Button variant="primary" size="md" type="button" children="Tillbaka till bostäder" />
                </Link>
            </section>
        )
    }

    return (
        <section className="flex flex-col gap-6 ">
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                <Link to="/bostader" className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 transition hover:border-neutral-400 hover:text-neutral-900"><ArrowLeftIcon className="h-4 w-4" /> Tillbaka</Link>
                <Link to="/bostader" className="py-2 text-green-500 hover:text-green-600">Bostäder</Link>
                <span>/</span>
                <span className="text-neutral-900">{apartment.street} {apartment.house_number}</span>
            </div>
            {apartmentLoading ?
                <div className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8">
                    <Skeleton variant="rounded" height="1000px" />
                </div>
                :
                <article className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8">
                    <h1 className="text-5xl">{apartment.street} {apartment.house_number}</h1>
                    <ImageCarousel images={apartment.images} size="large" rounded={true} />
                    <h2 className="text-2xl">Om bostaden</h2>
                    <p>{apartment.description}</p>
                    <h2 className="text-2xl">Visning</h2>
                    <p>Visning sker två veckor innan sista ansökningsdag. Du kommer att få en kallelse. Vänligen notera att visningstiden ej går att boka om. Om du inte kan delta i person går det bra att skicka en ersättare med giltlig legitimation. </p>
                    <h2 className="text-2xl">Detaljer</h2>
                    <ul className="grid md:grid-cols-2 md:gap-y-1">
                        <ApartmentList variant="ul" items={details} />
                    </ul>
                    {session ?
                        finalDateToApply && finalDateToApply >= new Date() ?
                            <ApartmentSignUp error={error} loading={loading} applied={applied} deleteSignUp={deleteSignUp} signUp={signUp} totalApplications={totalApplications} /> :
                            <div>Det går inte längre att ansöka denna lägenhet.</div>
                        :
                        <div>Du måste vara inloggad för att anmäla intressse. Vänligen <Link to="/inloggning" className="text-blue-500 hover:underline">logga in</Link> eller registrera ett konto.</div>
                    }
                </article>
            }
        </section>
    )
}

export default Apartment
