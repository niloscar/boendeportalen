import { CarIcon } from '@phosphor-icons/react';
import { formatNumber } from '../../utils/calc';
import type { AppliedParkingSectionProps } from '../../types/profile';

const AppliedParkingSection = ({ appliedParking }: AppliedParkingSectionProps) => (
    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8'>
        <div className='flex items-center gap-4'>
            <div
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500'
                aria-hidden='true'
            >
                <CarIcon size={20} weight='fill' className='text-white' />
            </div>
            <h2 className='text-lg font-semibold'>Sökta parkeringsplatser</h2>
        </div>

        <ul className='mt-4 flex flex-col gap-3'>
            {appliedParking.map((item) => (
                <li
                    key={item.applicationId}
                    className='border-l-2 border-green-500 pl-3 py-1 text-sm leading-6 space-y-1'
                >
                    <span className='block text-neutral-900'>Adress: {item.parking.address}, {item.parking.city}</span>
                    <span className='block text-neutral-900'>Typ: {item.parking.type}</span>
                    <span className='block text-neutral-900'>Hyra: {formatNumber(item.parking.price)} kr/mån</span>
                </li>
            ))}
        </ul>
    </section>
);

export default AppliedParkingSection;
