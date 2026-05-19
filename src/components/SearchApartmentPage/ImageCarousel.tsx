import { useState } from 'react';
import type { ApartmentImages } from "../../types/Apartment.ts";
import Style from '../../pages/SearchApartment.module.css';
type Props = {
    images: ApartmentImages[]
}
const ImageCarousel = ({ images }: Props) => {
    const [nextIndex, setNextIndex] = useState(0);
    const arrayLength = images.length;
    //onClick function to move "forward" one instance in our array
    function handleForwardClick() {
        if (nextIndex < arrayLength - 1) {
            setNextIndex(nextIndex + 1);
        } else {
            setNextIndex(0);
        }
    }

    //onClick function to move "backward" one instance in memory 
    function handleBackClick() {
        if (nextIndex > 0) {
            setNextIndex(nextIndex - 1);
        } else {
            setNextIndex(arrayLength - 1);
        }
    };

    return (
        <div>
            <div className={Style.slideshowContainer}>
                <img src={images[nextIndex].url} className={`h-50`} alt={images[nextIndex].description} />
                <a className={Style.prev} onClick={() => handleBackClick()}>❮</a>
                <a className={Style.next} onClick={() => handleForwardClick()}>❯</a>
            </div>

        </div>
    )
}

export default ImageCarousel
