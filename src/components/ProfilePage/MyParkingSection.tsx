import { CarIcon } from '@phosphor-icons/react';
import { formatNumber } from '../../utils/calc';
import type { ParkingSpotSummary } from '../../api/profilepageApi';

interface MyParkingSectionProps {
    myParking: ParkingSpotSummary[];
}

const MyParkingSection = ({ myParking }: MyParkingSectionProps) => (
    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8'>
        <div className='flex items-start gap-4'>
            <div
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100'
                aria-hidden='true'
            >
                <CarIcon size={20} className='text-neutral-500' />
            </div>
            <div className='flex-1'>
                <h2 className='text-lg font-semibold'>Min parkering</h2>

                <ul className='mt-4 space-y-4 text-sm leading-6 text-gray-700'>
                    {myParking.map((spot) => (
                        <li key={spot.id}>
                            <p>{spot.address}, {spot.city}</p>
                            <p>{spot.type}</p>
                            <p>Hyra: {formatNumber(spot.price)} kr/mån</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </section>
);

export default MyParkingSection;
