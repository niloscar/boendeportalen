import { HouseLineIcon, CarIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { Temporal } from '@js-temporal/polyfill';
import { formatNumber } from '../../utils/calc';
import { formatPostcode } from '../../hooks/useProfileData';
import type { AppliedApartmentSummary, AppliedSectionProps } from '../../types/profile';
import type { ApartmentData, Detail } from '../../types/apartment';

const buildNavigationState = (item: AppliedApartmentSummary) => {
    const { apartment, endDate } = item;

    const apartmentData: ApartmentData = {
        id: apartment.id,
        street: apartment.street,
        house_number: Number(apartment.house_number) || 0,
        postcode: apartment.postcode,
        city: apartment.city,
        area: Number(apartment.area) || 0,
        rooms: apartment.rooms ?? '',
        district: apartment.district ?? '',
        description: apartment.description ?? '',
        rent: item.rent ?? 0,
        end_date: Temporal.PlainDate.from(endDate).subtract({ weeks: 2 }).toString(),
        images: [],
    };

    const details: Detail[] = [
        { id: '1', title: 'Adress', content: `${apartment.street}, ${apartment.city}` },
        ...(apartment.area ? [{ id: '2', title: 'Storlek', content: `${apartment.area} kvm` }] : []),
        ...(apartment.rooms ? [{ id: '3', title: 'Rum', content: apartment.rooms }] : []),
        ...(apartment.district ? [{ id: '4', title: 'Stadsdel', content: apartment.district }] : []),
    ];

    return { apartment: apartmentData, details };
};

const AppliedSection = ({ appliedApartments, appliedParking }: AppliedSectionProps) => {
    const navigate = useNavigate();

    return (
        <section className='rounded-2xl border border-neutral-200 bg-white shadow-md'>
            <div className='flex flex-col md:flex-row'>

                <div className='flex-1 p-6 sm:p-8'>
                    <div className='flex items-center gap-4'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500' aria-hidden='true'>
                            <HouseLineIcon size={20} weight='fill' className='text-white' />
                        </div>
                        <h2 className='text-lg font-semibold'>Sökta lägenheter</h2>
                    </div>

                    {appliedApartments.length > 0 ? (
                        <ul className='mt-4 flex flex-col gap-3'>
                            {appliedApartments.map((item) => (
                                <li key={item.signUpId}>
                                    <button
                                        onClick={() => navigate(`/bostader/${item.apartment.id}`, { state: buildNavigationState(item) })}
                                        className='group w-full cursor-pointer rounded-2xl bg-neutral-100 border border-neutral-200 p-4 text-left text-sm leading-6 transition hover:border-neutral-300 flex items-center justify-between gap-4'
                                    >
                                        <div className='space-y-1'>
                                            <span className='block text-neutral-900'>Adress: {[item.apartment.street, item.apartment.house_number, item.apartment.stairwell].filter(Boolean).join(' ')}, {formatPostcode(item.apartment.postcode)} {item.apartment.city}</span>
                                            {item.apartment.area && <span className='block text-neutral-900'>Storlek: {item.apartment.area} kvm</span>}
                                            {item.apartment.rooms && <span className='block text-neutral-900'>Rum: {item.apartment.rooms}</span>}
                                            {item.rent !== null && <span className='block text-neutral-900'>Hyra: {formatNumber(item.rent)} kr/mån</span>}
                                        </div>
                                        <ArrowRightIcon size={20} className='shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-green-500' />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='mt-4 text-sm text-gray-600'>Du har inga aktiva intresseanmälningar.</p>
                    )}
                </div>

                <div className='hidden md:block w-px bg-neutral-200 my-6' aria-hidden='true' />
                <div className='block md:hidden h-px bg-neutral-200 mx-6' aria-hidden='true' />

                <div className='flex-1 p-6 sm:p-8'>
                    <div className='flex items-center gap-4'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500' aria-hidden='true'>
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
                                        className='group w-full cursor-pointer rounded-2xl bg-neutral-100 border border-neutral-200 p-4 text-left text-sm leading-6 transition hover:border-neutral-300 flex items-center justify-between gap-4'
                                    >
                                        <div className='space-y-1'>
                                            <span className='block text-neutral-900'>Adress: {item.parking.address}, {formatPostcode(item.parking.postalCode)} {item.parking.city}</span>
                                            <span className='block text-neutral-900'>Typ: {item.parking.type}</span>
                                            <span className='block text-neutral-900'>Hyra: {formatNumber(item.parking.price)} kr/mån</span>
                                        </div>
                                        <ArrowRightIcon size={20} className='shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-green-500' />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='mt-4 text-sm text-gray-600'>Du har inga aktiva intresseanmälningar.</p>
                    )}
                </div>

            </div>
        </section>
    );
};

export default AppliedSection;
