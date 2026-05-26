import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import type { ParkingSpot } from '../../types/parking'
import { formatNumber } from '../../utils/calc';

export default function ParkingCard({ spot }: { spot: ParkingSpot }) {
    return (
        <Link
            to={`/parkeringar/${spot.id}`}
            aria-label={`Visa information om parkeringsplats ${spot.address}`}
            className="block focus:outline-none focus:ring-2 focus:ring-green-500 rounded-xl"
        >
            <article className="w-full bg-white border border-neutral-300 rounded-xl shadow-md group hover:shadow-lg transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-green-500">
                <img
                    src={`https://klimatkommunerna.se/wp-content/uploads/2019/09/parking-5120x3413.jpg`}
                    alt={`${spot.type} vid ${spot.address}`}
                    className="w-full aspect-[4/3] object-cover rounded-t-xl"
                />

                <div className="flex flex-col gap-1 p-4">
                    <h2 className="text-xl font-semibold">{spot.address}</h2>
                    <p className="text-gray-600">{spot.city}, {spot.postalCode}</p>
                    <p className="text-gray-600">{spot.type}</p>
                    <p className="text-gray-600">Ledig fr.o.m <strong>{new Date(spot.availableFrom).toLocaleDateString('sv-SE')}</strong></p>
                    <p className="text-gray-600">Hyra: <strong>{formatNumber(spot.price)} kr</strong>/mån</p>

                    <div className="mt-4 flex items-center justify-between text-sm sm:text-base pt-4 border-t border-neutral-300 text-neutral-900 font-medium">
                        <span>Visa information</span>
                        <ArrowRightIcon className="h-5 w-5" />
                    </div>
                </div>
            </article>
        </Link>
    )
}
