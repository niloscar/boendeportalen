import { useState } from 'react';
import type { ApartmentImages } from "../../types/Apartment.ts";
import Style from '../../pages/SearchApartment.module.css';

type Props = {
    images: ApartmentImages[]
}
const ImageCarousel = ({ images }: Props) => {
    const [nextIndex, setNextIndex] = useState(0);
    const arrayLength = images.length;

    function forward() {
        if (nextIndex < arrayLength - 1) {
            setNextIndex(nextIndex + 1);
        } else {
            setNextIndex(0);
        }
    }
    function back() {
        if (nextIndex > 0) {
            setNextIndex(nextIndex - 1);
        } else {
            setNextIndex(arrayLength - 1);
        }
    };

    return (
        <div className="relative m-auto w-full">
            <img src={images[nextIndex].url} className={`h-50 m-auto`} alt={images[nextIndex].description} />
            <a className={Style.prev} onClick={() => back()}>❮</a>
            <a className={Style.next} onClick={() => forward()}>❯</a>
        </div>
    )
}

export default ImageCarousel
