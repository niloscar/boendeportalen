import ApartmentCard from './ApartmentCard.tsx';
import ListItem from './ListItem.tsx';
import type { ApartmentListProp } from "../../types/apartment.ts";

const ApartmentList = (props: ApartmentListProp) => {
    return (
        props.variant === 'div' ?
            props.items.map((item) => (
                <ApartmentCard key={item.id} apartment={item} />
            )) :
            props.items.map((item) => (
                <ListItem key={item.id} detail={item} />
            ))
    )
}

export default ApartmentList 
