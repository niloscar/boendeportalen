import { Skeleton } from '@mui/material';

const ProfilePageSkeleton = () => (
    <>
        <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8'>
            <div className='grid gap-8 lg:grid-cols-[1.2fr_1fr]'>
                <div className='flex flex-col gap-6'>
                    <div className='flex items-start gap-4'>
                        <Skeleton variant='circular' width={40} height={40} />
                        <div className='flex-1'>
                            <Skeleton variant='text' width='40%' height={28} />
                            <div className='mt-4 space-y-2'>
                                <Skeleton variant='text' width='80%' />
                                <Skeleton variant='text' width='50%' />
                                <Skeleton variant='text' width='40%' />
                                <Skeleton variant='text' width='55%' />
                            </div>
                        </div>
                    </div>
                    <div className='grid gap-4 sm:grid-cols-2'>
                        <Skeleton variant='rounded' height={52} />
                        <Skeleton variant='rounded' height={52} />
                        <Skeleton variant='rounded' height={52} />
                        <Skeleton variant='rounded' height={52} />
                    </div>
                </div>
                <Skeleton variant='rounded' height={280} />
            </div>
        </section>

        <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8'>
            <div className='flex items-start gap-4'>
                <Skeleton variant='circular' width={40} height={40} />
                <div className='flex-1'>
                    <Skeleton variant='text' width='35%' height={28} />
                    <div className='mt-3 space-y-2'>
                        <Skeleton variant='text' width='70%' />
                        <Skeleton variant='text' width='60%' />
                        <Skeleton variant='text' width='50%' />
                    </div>
                </div>
            </div>
        </section>

        <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8'>
            <div className='flex items-start gap-4'>
                <Skeleton variant='circular' width={40} height={40} />
                <div className='flex-1'>
                    <Skeleton variant='text' width='30%' height={28} />
                    <Skeleton variant='rounded' height={48} className='mt-6' />
                    <Skeleton variant='rounded' height={48} className='mt-3' />
                </div>
            </div>
        </section>
    </>
);

export default ProfilePageSkeleton;
