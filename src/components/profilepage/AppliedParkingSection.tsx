import { CarIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../../utils/calc';
import type { AppliedParkingSectionProps } from '../../types/profile';

const AppliedParkingSection = ({ appliedParking }: AppliedParkingSectionProps) => {
    const navigate = useNavigate();

    return (
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

            {appliedParking.length > 0 ? (
                <ul className='mt-4 flex flex-col gap-3'>
                    {appliedParking.map((item) => (
                        <li key={item.applicationId}>
                            <button
                                onClick={() => navigate(`/parkeringar/${item.parking.id}`)}
                                className='group border-l-2 border-green-500 pl-3 py-1 text-left text-sm leading-6 transition hover:border-green-700 inline-flex items-center gap-2'
                            >
                                <div className='space-y-1'>
                                    <span className='block text-neutral-900'>Adress: {item.parking.address}, {item.parking.city}</span>
                                    <span className='block text-neutral-900'>Typ: {item.parking.type}</span>
                                    <span className='block text-neutral-900'>Hyra: {formatNumber(item.parking.price)} kr/mån</span>
                                </div>
                                <ArrowRightIcon size={16} className='shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-green-500' />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className='mt-4 text-sm text-gray-600'>
                    Du har inga aktiva intresseanmälningar.
                </p>
            )}
        </section>
    );
};

export default AppliedParkingSection;
