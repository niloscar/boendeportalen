import ApartmentCard from './ApartmentCard.tsx';
import ListItem from './ListItem.tsx';
import type { ApartmentListProp } from "../../types/apartment.ts";

const ApartmentList = ({ variant, items }: ApartmentListProp) => {
    return (
        variant === 'div' ?
            items.map((item) => (
                <ApartmentCard key={item.id} apartment={item} />
            )) :
            items.map((item) => (
                <ListItem key={item.id} detail={item} />
            ))
    )
}

export default ApartmentList 
