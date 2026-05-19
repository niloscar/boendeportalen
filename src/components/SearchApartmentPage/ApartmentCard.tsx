import { useState, useEffect } from 'react';
import { getApartmentImages } from '../../api/apartmentApi.ts';
import type { ApartmentData, ApartmentImages } from "../../types/Apartment.ts";
import ImageCarousel from './ImageCarousel.tsx';
import Button from '../ui/Button.tsx';

type Props = {
    apartment: ApartmentData
}

const ApartmentCard = ({ apartment }: Props) => {
    const [images, setImages] = useState<ApartmentImages[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    function subtractMonths(date: Date, months: number) {
        date.setMonth(date.getMonth() - months);
        return date;
    }

    const getImages = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getApartmentImages(apartment.id);
            setImages(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (apartment.id != null) {
            getImages();
        }
    }, [])
    const lastDay = subtractMonths(new Date(apartment.end_date), 1);
    const month = String(Math.round(lastDay.getMonth()) + 1).padStart(2, "0");
    const day = String(lastDay.getDate()).padStart(2, "0");

    if (loading) {
        return (<div>Laddar lägenheter, vänligen vänta</div>)
    }
    if (error) {
        return (<div>Problem med att hämta lägenheter. Vänligen ladda om sidan och försök igen. </div>)
    }
    return (
        <section className="border border-solid border-green-500 rounded-2xl bg-white p-4 flex flex-col items-center basis-full gap-4 max-w-xs">
            <ImageCarousel images={images} />
            <h2 className="text-2xl">{apartment.street}</h2>
            <section className="w-full">
                <ul className="w-full">
                    <li className="flex w-full justify-between"><p className="font-semibold">Hyra:</p><p className="self-end">{apartment.rent}</p></li>
                    <li className="flex w-full justify-between"><p className="font-semibold">Antal rum:</p><p className="self-end">{apartment.rooms}</p></li>
                    <li className="flex w-full justify-between"><p className="font-semibold">Inflyttning:</p><p className="self-end">{apartment.end_date}</p></li>
                    <li className="flex w-full justify-between"><p className="font-semibold">Sista anmälningsdag:</p><p className="self-end">{lastDay.getFullYear()}-{month}-{day}</p></li>
                    <li className="flex w-full justify-between"><p className="font-semibold">Område:</p><p className="self-end">{apartment.district}</p></li>
                </ul>
            </section>
            <Button variant="secondary" size="md" type="button" children="Läs mer" className="self-start" />
        </section>
    )
}

export default ApartmentCard
