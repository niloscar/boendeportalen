import ApartmentCard from './ApartmentCard.tsx'
import type { FullData } from "../types/Apartment.ts";
type Props = {
    apartments: FullData[]
}

const ApartmentList = ({ apartments }: Props)  => {
    return (
        <div className="flex flex-row gap-4 items-center">
            {apartments.map(( apartment : FullData) => (
                <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
        </div>
    )
}

export default ApartmentList 
