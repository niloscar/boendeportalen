import Skeleton from '@mui/material/Skeleton'

export default function ParkingSkeletonCards() {
    return (
        <article className="w-full overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100 shadow-md">
            <Skeleton variant="rounded" animation="wave" height={168} />

            <div className="flex flex-col gap-3 p-4">
                <Skeleton variant="text" animation="wave" height={32} width="70%" />
                <Skeleton variant="text" animation="wave" height={24} width="55%" />
                <Skeleton variant="text" animation="wave" height={24} width="45%" />
                <Skeleton variant="text" animation="wave" height={24} width="80%" />
                <Skeleton variant="text" animation="wave" height={24} width="60%" />

                <div className="mt-4 border-t border-neutral-300 pt-4">
                    <Skeleton variant="text" animation="wave" height={24} width="48%" />
                </div>
            </div>
        </article>
    )
}