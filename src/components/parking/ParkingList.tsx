import ParkingCard from './ParkingCard'
import Pagination from '../ui/Pagination'
import ParkingSkeletonCards from './skeletons/ParkingSkeletonCards'
import type { ParkingListProps } from '../../types/parking'

export default function ParkingList({ currentSpots, totalPages, currentPage, onPageChange, isLoading, loadError, hasSpots }: ParkingListProps) {
    if (isLoading) {
        return (
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-live="polite">
                <ParkingSkeletonCards />
                <ParkingSkeletonCards />
                <ParkingSkeletonCards />
                <ParkingSkeletonCards />
                <ParkingSkeletonCards />
                <ParkingSkeletonCards />
            </div>
        )
    }
    if (loadError) return <p className="text-red-600">{loadError}</p>
    if (!hasSpots) return <p className="text-gray-600">Inga parkeringsplatser matchar dina filter.</p>

    return (
        <>
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {currentSpots.map((spot) => (<ParkingCard key={spot.id} spot={spot} />))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />
            )}
        </>
    )
}
