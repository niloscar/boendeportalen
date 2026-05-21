import ApartmentCard from './ApartmentCard.tsx'
import type { ApartmentListProp } from "../../types/Apartment.ts";

const ApartmentList = ({ apartments } : ApartmentListProp)  => {
    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 auto-cols-max gap-4 items-start">
            {apartments.map(( apartment ) => (
                <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
        </div>
    )
}

export default ApartmentList 
