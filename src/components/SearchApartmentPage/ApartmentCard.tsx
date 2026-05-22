import { Link } from 'react-router-dom'
import type { ApartmentProp } from "../../types/apartment.ts";
import ImageCarousel from './ImageCarousel.tsx';
import ApartmentList from './ApartmentList.tsx';
import Button from '../ui/Button.tsx';

const ApartmentCard = ({ apartment }: ApartmentProp) => {
    const apartmentArray = Object.values(apartment);
    const calculateLastDay = subtractMonths(new Date(apartment.end_date), 1);
    const applyBy = calculateLastDay.toISOString().split("T")[0];
    const details = [
        {
            id: crypto.randomUUID(),
            title: "id",
            content: apartmentArray[0]
        },
        {
            id: crypto.randomUUID(),
            title: "Kvadratmeter",
            content: apartmentArray[4]
        },
        {
            id: crypto.randomUUID(),
            title: "Antal rum",
            content: apartmentArray[5]
        },
        {
            id: crypto.randomUUID(),
            title: "Hyra",
            content: apartmentArray[9]
        },
        {
            id: crypto.randomUUID(),
            title: "Område",
            content: apartmentArray[6]
        },
        {
            id: crypto.randomUUID(),
            title: "Tillgänglig från",
            content: apartmentArray[8]
        },
        {
            id: crypto.randomUUID(),
            title: "Sista ansökningsdag",
            content: applyBy
        },     
    ]

    function subtractMonths(date: Date, months: number) {
        date.setMonth(date.getMonth() - months);
        return date;
    }

    return (
        <section className="border border-solid border-green-500 rounded-2xl bg-white p-4 flex flex-col items-center basis-full gap-4 w-xs">
            <ImageCarousel images={apartment.images} size="small" />
            <h2 className="text-2xl">{apartment.street}</h2>
            <section className="w-full">
                <ul className="w-full">
                    <ApartmentList variant="ul" items={details} />
                </ul>
            </section>
            <Link to={`/apartment/${apartment.id}`} state={{ apartment: apartment, details: details }} className="self-start">
                <Button variant="secondary" size="md" type="button" children="Läs mer" />
            </Link>
        </section>
    )
}

export default ApartmentCard
