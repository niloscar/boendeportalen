import { Link } from 'react-router-dom'
import type { ApartmentProp } from "../../types/apartment.ts";
import ImageCarousel from './ImageCarousel.tsx';
import ApartmentList from './ApartmentList.tsx';
import { ArrowRightIcon } from '@phosphor-icons/react'
import { getDetails } from '../../utils/apartments.ts'

const ApartmentCard = ({ apartment }: ApartmentProp) => {
    const details = apartment ? getDetails(apartment) : null;

    if (!apartment || !details) {
        return (
            <section className="border border-solid border-green-500 rounded-2xl bg-white p-4 flex flex-col items-center basis-full gap-4 w-xs h-auto">
                <h2 className="text-2xl">Problem med att läsa in lägenheten. Vänligen ladda om sidan.</h2>
            </section>
        )
    }
    
    return (
        <Link to={`/bostader/${apartment.id}`} aria-label='Läs mer om bostaden' state={{ apartment: apartment, details: details }} className="block focus:outline-none focus:ring-2 focus:ring-green-500 rounded-xl">
            <article className="w-full bg-white border border-neutral-300 rounded-xl shadow-md group hover:shadow-lg transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-green-500">
                <ImageCarousel images={apartment.images} size="small" rounded={false} />
                <div className="flex flex-col gap-1 p-4">
                    <h2 className="text-xl font-semibold">{apartment.street} {apartment.house_number}</h2>
                    <section className="w-full text-gray-600">
                        <ul className="w-full">
                            <ApartmentList variant="ul" items={details} />
                        </ul>
                    </section>
                    <div className="mt-4 flex items-center justify-between text-sm sm:text-base pt-4 border-t border-neutral-300 text-neutral-900 font-medium">
                        <span>Visa information</span>
                        <ArrowRightIcon className="h-5 w-5" />
                    </div>
                </div>
            </article>
        </Link>
    )
}

export default ApartmentCard
