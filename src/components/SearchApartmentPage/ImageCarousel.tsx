import { useState } from 'react';
import type { ApartmentImages } from "../../types/Apartment.ts";

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
            <a className={`hover:bg-neutral-200 absolute top-[40%] cursor-pointer text-green-500 rounded-l text-2xl p-4`} onClick={() => back()}>❮</a>
            <a className={`hover:bg-neutral-200 absolute top-[40%] right-0 cursor-pointer text-green-500 rounded-r text-2xl p-4`} onClick={() => forward()}>❯</a>
        </div>
    )
}

export default ImageCarousel
