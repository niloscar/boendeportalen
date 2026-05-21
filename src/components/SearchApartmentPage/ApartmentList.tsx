import Skeleton from '@mui/material/Skeleton';
import ApartmentCard from './ApartmentCard.tsx'
import type { ApartmentListProp } from "../../types/Apartment.ts";

const ApartmentList = ({ apartments, loading }: ApartmentListProp) => {
    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 auto-cols-max gap-4 items-start">
            {loading ?
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 auto-cols-max gap-4 items-start">
                    <Skeleton variant="rounded" className="w-xs" height="502px" />
                    <Skeleton variant="rounded" className="w-xs" height="502px" />
                    <Skeleton variant="rounded" className="w-xs" height="502px" />
                </div>
                :
                apartments.length < 1 ? <div>Kunde inte hitta några lediga lägenheter</div> :
                    apartments.map((apartment) => (
                        <ApartmentCard key={apartment.id} apartment={apartment} />
                    ))
            }
        </div>
    )
}

export default ApartmentList 
