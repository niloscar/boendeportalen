import { Link } from 'react-router-dom'
import type { ApartmentProp } from "../../types/Apartment.ts";
import ImageCarousel from './ImageCarousel.tsx';
import Button from '../ui/Button.tsx';

const ApartmentCard = ({ apartment }: ApartmentProp) => {

    function subtractMonths(date: Date, months: number) {
        date.setMonth(date.getMonth() - months);
        return date;
    }
   
    const lastDay = subtractMonths(new Date(apartment.end_date), 1);
    const applyBy = lastDay.toISOString().split("T")[0];

    return (
        <section className="border border-solid border-green-500 rounded-2xl bg-white p-4 flex flex-col items-center basis-full gap-4 w-xs">
            <ImageCarousel images={apartment.images} />
            <h2 className="text-2xl">{apartment.street}</h2>
            <section className="w-full">
                <ul className="w-full">
                    <li className="flex w-full justify-between"><p className="font-semibold">Hyra:</p><p className="self-end">{apartment.rent}</p></li>
                    <li className="flex w-full justify-between"><p className="font-semibold">Antal rum:</p><p className="self-end">{apartment.rooms}</p></li>
                    <li className="flex w-full justify-between"><p className="font-semibold">Inflyttning:</p><p className="self-end">{apartment.end_date}</p></li>
                    <li className="flex w-full justify-between"><p className="font-semibold">Sista anmälningsdag:</p><p className="self-end">{applyBy}</p></li>
                    <li className="flex w-full justify-between"><p className="font-semibold">Område:</p><p className="self-end">{apartment.district}</p></li>
                </ul>
            </section>
            <Link to={`/apartment/${apartment.id}`} state={{apartment: apartment, applyBy: applyBy}}>
                <Button variant="secondary" size="md" type="button" children="Läs mer" className="self-start" />
            </Link>
        </section>
    )
}

export default ApartmentCard
