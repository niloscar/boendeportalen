import ApartmentCard from './ApartmentCard.tsx'
import type { ApartmentData } from "../../types/Apartment.ts";
type Props = {
    apartments: ApartmentData[]
}

const ApartmentList = ({ apartments }: Props)  => {
    return (
        <div className="grid grid-cols-3 gap-4 items-start">
            {apartments.map(( apartment : ApartmentData) => (
                <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
        </div>
    )
}

export default ApartmentList 
