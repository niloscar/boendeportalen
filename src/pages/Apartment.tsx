import { useLocation, Link } from 'react-router-dom';
import ImageCarousel from '../components/searchapartment/ImageCarousel.tsx';
import Button from '../components/ui/Button.tsx';
import ApartmentList from '../components/searchapartment/ApartmentList.tsx';
import type { ApartmentData, Detail } from '../types/apartment.ts';
import ApartmentSignUp from '../components/searchapartment/ApartmentSignUp.tsx';
import { useApartmentSignUp } from '../hooks/useApartmentSignUp.tsx';
import { useSession } from '../hooks/useAuth.ts';

const Apartment = () => {
    const { state } = useLocation();
    const session = useSession();
    const apartment: ApartmentData = state && state.apartment;
    const details: Detail[] = state && state.details;
    const {
        signUp,
        deleteSignUp,
        loading,
        error,
        applied,
    } = useApartmentSignUp({ apartment });

    if (!apartment || !details) {
        return (
            <section className="flex flex-col items-center gap-6 p-6 w-full">
                <p>Kunde inte hämta information om lägenheten. Vänligen gå tillbaka och försök igen.</p>
                <Link to="/bostader">
                    <Button variant="primary" size="md" type="button" children="Tillbaka till sök" />
                </Link>
            </section>
        )
    }

    return (
        <section className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8">
            <h1 className="text-5xl">{apartment.street}</h1>
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
                <div><ApartmentSignUp error={error} loading={loading} applied={applied} deleteSignUp={deleteSignUp} signUp={signUp} /></div> :
                <div>Du måste vara inloggad för att anmäla intressse. Vänligen <a href="/inloggning" className="text-green-500 hover:underline">logga in</a> eller registrera ett konto.</div>
            }
        </section>
    )
}

export default Apartment
