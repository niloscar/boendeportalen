import ApartmentCard from './ApartmentCard.tsx'
import type { ApartmentData } from "../../types/Apartment.ts";
type Props = {
    apartments: ApartmentData[]
}

const ApartmentList = ({ apartments }: Props)  => {
    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 auto-cols-max gap-4 items-start">
            {apartments.map(( apartment : ApartmentData) => (
                <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
        </div>
    )
}

export default ApartmentList 
