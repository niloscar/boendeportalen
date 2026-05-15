import ApartmentCard from './ApartmentCard.tsx'
import type { Apartment } from "../types/Apartment.ts";
type Props = {
    apartments: Apartment[]
}

const ApartmentList = ({ apartments }: Props)  => {
    return (
        <div className="flex flex-row gap-4 items-center">
            {apartments.map(( apartment : Apartment) => (
                <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
        </div>
    )
}

export default ApartmentList 
