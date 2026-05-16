import ApartmentCard from './ApartmentCard.tsx'
import type { ApartmentData } from "../types/Apartment.ts";
type Props = {
    apartments: ApartmentData[]
}

const ApartmentList = ({ apartments }: Props)  => {
    return (
        <div className="flex flex-row gap-4 items-center">
            {apartments.map(( apartment : ApartmentData) => (
                <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
        </div>
    )
}

export default ApartmentList 
