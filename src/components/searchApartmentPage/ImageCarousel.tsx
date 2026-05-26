import { useState } from 'react';
import type React from 'react';
import type { ApartmentImagesProp } from "../../types/apartment.ts";

const ImageCarousel = ({ images, size }: ApartmentImagesProp) => {
    const [nextIndex, setNextIndex] = useState(0);
    const arrayLength = images.length;

    const forward: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        if (nextIndex < arrayLength - 1) {
            setNextIndex(nextIndex + 1);
        } else {
            setNextIndex(0);
        }
    }
    const back: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        if (nextIndex > 0) {
            setNextIndex(nextIndex - 1);
        } else {
            setNextIndex(arrayLength - 1);
        }
    };
    const imageSize = size == 'large' ? "md:h-110" : "h-50";
    return (
        images.length > 0 ?
            <div className="relative m-auto w-full">
                <img src={images[nextIndex].url} className={`w-full object-fill rounded-2xl h-50 ${imageSize} m-auto`} alt={images[nextIndex].description} />
                <button className={`hover:bg-neutral-200 absolute top-[40%] cursor-pointer text-green-500 rounded-l text-2xl p-4`} onClick={(e) => back(e)}>❮</button>
                <button className={`hover:bg-neutral-200 absolute top-[40%] right-0 cursor-pointer text-green-500 rounded-r text-2xl p-4`} onClick={(e) => forward(e)}>❯</button>
            </div>
            :
            <div>Bilder ej tillgänliga</div>
    )
}

export default ImageCarousel
