import { CarIcon } from '@phosphor-icons/react';
import { formatNumber } from '../../utils/calc';
import type { AppliedParkingSummary } from '../../api/profilepageApi';

interface AppliedParkingSectionProps {
    appliedParking: AppliedParkingSummary[];
}

const AppliedParkingSection = ({ appliedParking }: AppliedParkingSectionProps) => (
    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8'>
        <div className='flex items-start gap-4'>
            <div
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100'
                aria-hidden='true'
            >
                <CarIcon size={20} className='text-neutral-500' />
            </div>
            <div className='flex-1'>
                <h2 className='text-lg font-semibold'>Sökta parkeringsplatser</h2>

                <ul className='mt-4 flex flex-col gap-3'>
                    {appliedParking.map((item) => (
                        <li
                            key={item.applicationId}
                            className='rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm'
                        >
                            <span className='block font-medium text-neutral-900'>
                                {item.parking.address}, {item.parking.city}
                            </span>
                            <span className='text-xs text-neutral-500'>{item.parking.type}</span>
                            <span className='mt-1 block text-xs text-neutral-700'>
                                Hyra: {formatNumber(item.parking.price)} kr/mån
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </section>
);

export default AppliedParkingSection;
