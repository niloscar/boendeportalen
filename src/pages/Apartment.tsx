import { useLocation } from 'react-router';
import ImageCarousel from '../components/SearchApartmentPage/ImageCarousel.tsx';
import Button from '../components/ui/Button.tsx';

const Apartment = () => {
  const location = useLocation();
  const apartmentInfo = location.state.apartment;
  const lastDayToApply = location.state.applyBy;

  return (
    <section className="flex flex-col gap-6 p-6 max-w-4xl">
      <h1 className="text-5xl">{apartmentInfo.street}</h1>
      <ImageCarousel images={apartmentInfo.images} />
      <h2 className="text-2xl">Om bostaden</h2>
      <p>{apartmentInfo.description}</p>
      <h2 className="text-2xl">Visning</h2>
      <p>Visning sker två veckor innan sista ansökningsdag. Vi kan ej boka om visningar. Om du ej kan delta är det OK att skicka en ersättare som kan visa upp din legitimation.</p>
      <h2 className="text-2xl">Detaljer</h2>
      <ul>
        <li className="flex w-full gap-4">
          <p className="font-semibold">Hyra:</p> <p>{apartmentInfo.rent}</p>
        </li>
        <li>Antal rum: {apartmentInfo.rooms}</li>
        <li>Storlek: {apartmentInfo.area}m2</li>
        <li>Område: {apartmentInfo.district}</li>
        <li>Tillgänglig från: {apartmentInfo.end_date}</li>
        <li>Sista anmälningsdag: {lastDayToApply}</li>
      </ul>
      <Button variant="primary" size="md" type="button" children="Anmäl intresse" />
    </section>
  )
}

export default Apartment
