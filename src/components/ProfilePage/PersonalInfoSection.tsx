import type { ChangeEvent } from 'react';
import Button from '../ui/Button';

interface PersonalInfoSectionProps {
    personalInfo: string[] | null;
    onEditProfile: () => void;
    onAvatarUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection = ({
    personalInfo,
    onEditProfile,
    onAvatarUpload,
}: PersonalInfoSectionProps) => (
    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8'>
        <div className='flex items-start gap-4'>
            <div
                className='flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-lg text-neutral-500'
                aria-hidden='true'
            >
                ⍰
            </div>
            <div>
                <h2 className='text-lg font-semibold'>Mina uppgifter</h2>
                {personalInfo ? (
                    <div className='mt-5 space-y-1 text-sm leading-6 text-gray-700'>
                        {personalInfo.map((info) => (
                            <p key={info}>{info}</p>
                        ))}
                    </div>
                ) : (
                    <p className='mt-5 text-sm leading-6 text-gray-600'>
                        Inga personuppgifter tillgängliga.
                    </p>
                )}

                <div className='mt-6 flex flex-col gap-4 sm:flex-row sm:items-center'>
                    <Button variant='primary' size='md' onClick={onEditProfile}>
                        Ändra uppgifter
                    </Button>
                    <label className='flex items-center gap-3 text-sm text-gray-700'>
                        <span>Ladda upp avatar</span>
                        <input
                            type='file'
                            accept='image/png,image/jpeg,image/webp'
                            onChange={onAvatarUpload}
                            className='rounded-2xl border border-neutral-300 bg-white px-3 py-2 text-sm'
                        />
                    </label>
                </div>
            </div>
        </div>
    </section>
);

export default PersonalInfoSection;
