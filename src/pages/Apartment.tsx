import { useLocation } from 'react-router';
import ImageCarousel from '../components/SearchApartmentPage/ImageCarousel.tsx';
import Button from '../components/ui/Button.tsx';
import ApartmentList from '../components/SearchApartmentPage/ApartmentList.tsx';

const Apartment = () => {
    const location = useLocation();
    const apartmentInfo = location.state.apartment;
    const details = location.state.details;

    return (
        <section className="flex flex-col gap-6 p-6 max-w-3xl">
            <div className="flex justify-between">
                <h1 className="text-5xl">{apartmentInfo.street}</h1>
                <Button variant="primary" size="md" type="button" children="Anmäl intresse" />
            </div>
            <ImageCarousel images={apartmentInfo.images} size="large" />
            <h2 className="text-2xl">Om bostaden</h2>
            <p>{apartmentInfo.description}</p>
            <h2 className="text-2xl">Visning</h2>
            <p>Visning sker två veckor innan sista ansökningsdag. Du kommer att få en kallelse. Vänligen notera att visningstiden ej går att boka om. Om du inte kan delta i person går det bra att skicka en ersättare med giltlig legitimation. </p>
            <h2 className="text-2xl">Detaljer</h2>
            <ul className="max-w-md">
                <ApartmentList variant="ul" items={details} />
            </ul>
            <Button variant="primary" size="md" type="button" children="Anmäl intresse" />
        </section>
    )
}

export default Apartment
