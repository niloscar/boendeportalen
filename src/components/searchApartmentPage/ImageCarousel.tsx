import { useState } from 'react';
import type React from 'react';
import type { ApartmentImagesProp } from "../../types/apartment.ts";
import { CaretRightIcon, CaretLeftIcon } from "@phosphor-icons/react"


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
    const imageSize = size == 'large' ? "md:h-110" : "h-70";
    return (
        images.length > 0 ?
            <div className="relative m-auto w-full">
                <img src={images[nextIndex].url} className={`w-full object-cover rounded-2xl h-70 ${imageSize} m-auto`} alt={images[nextIndex].description} />
                <button className={`hover:bg-neutral-200 absolute top-[40%] text-green-500 rounded-l p-4`} onClick={(e) => back(e)}><CaretLeftIcon weight="bold" size={32}/></button>
                <button className={`hover:bg-neutral-200 absolute top-[40%] right-0 text-green-500 rounded-r p-4`} onClick={(e) => forward(e)}><CaretRightIcon weight="bold" size={32}/></button>
            </div>
            :
            <div>Bilder ej tillgänliga</div>
    )
}

export default ImageCarousel
