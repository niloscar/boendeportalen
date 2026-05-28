import { HouseLineIcon } from '@phosphor-icons/react';
import { Temporal } from '@js-temporal/polyfill';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../../utils/calc';
import type { AppliedApartmentSummary } from '../../types/profile';
import type { ApartmentData, Detail } from '../../types/apartment';

interface AppliedApartmentsSectionProps {
    appliedApartments: AppliedApartmentSummary[];
}

const buildNavigationState = (item: AppliedApartmentSummary) => {
    const { apartment, endDate } = item;

    const apartmentData: ApartmentData = {
        id: apartment.id,
        street: apartment.street,
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

const AppliedApartmentsSection = ({ appliedApartments }: AppliedApartmentsSectionProps) => {
    const navigate = useNavigate();

    return (
        <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8'>
            <div className='flex items-center gap-4'>
                <div
                    className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500'
                    aria-hidden='true'
                >
                    <HouseLineIcon size={20} weight='fill' className='text-white' />
                </div>
                <h2 className='text-lg font-semibold'>Sökta lägenheter</h2>
            </div>

            {appliedApartments.length > 0 ? (
                <ul className='mt-4 flex flex-col gap-3'>
                    {appliedApartments.map((item) => (
                        <li key={item.signUpId}>
                            <button
                                onClick={() =>
                                    navigate(`/bostader/${item.apartment.id}`, {
                                        state: buildNavigationState(item),
                                    })
                                }
                                className='w-full border-l-2 border-green-500 pl-3 py-1 text-left text-sm leading-6 space-y-1 transition hover:border-green-700'
                            >
                                <span className='block text-neutral-900'>Adress: {item.apartment.street}, {item.apartment.city}</span>
                                {item.apartment.area && <span className='block text-neutral-900'>Storlek: {item.apartment.area} kvm</span>}
                                {item.apartment.rooms && <span className='block text-neutral-900'>Rum: {item.apartment.rooms}</span>}
                                {item.rent !== null && <span className='block text-neutral-900'>Hyra: {formatNumber(item.rent)} kr/mån</span>}
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

export default AppliedApartmentsSection;
