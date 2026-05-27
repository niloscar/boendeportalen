import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { UserIcon } from '@phosphor-icons/react';
import Button from '../ui/Button';
import { signOut } from '../../lib/supabase';

interface PersonalInfoSectionProps {
    name: string | null;
    email: string | null;
    phone: string | null;
    avatarUrl: string | null;
    onSave: (data: { email: string; phone: string }) => Promise<void>;
    onAvatarUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

const validateEmail = (value: string): string | null =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? null : 'Ange en giltig e-postadress.';

const validatePhone = (value: string): string | null => {
    const digits = value.replace(/[\s\-()+]/g, '');
    return /^\d{7,}$/.test(digits) ? null : 'Ange ett giltigt telefonnummer.';
};

const inputClass =
    'w-full rounded-xl border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500';

const PersonalInfoSection = ({
    name,
    email,
    phone,
    avatarUrl,
    onSave,
    onAvatarUpload,
}: PersonalInfoSectionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [emailValue, setEmailValue] = useState(email ?? '');
    const [phoneValue, setPhoneValue] = useState(phone ?? '');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const startEditing = () => {
        setEmailValue(email ?? '');
        setPhoneValue(phone ?? '');
        setEmailError(null);
        setPhoneError(null);
        setIsEditing(true);
    };

    const cancel = () => {
        setIsEditing(false);
        setEmailError(null);
        setPhoneError(null);
    };

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        const eErr = validateEmail(emailValue);
        const pErr = validatePhone(phoneValue);
        setEmailError(eErr);
        setPhoneError(pErr);
        if (eErr || pErr) return;

        setIsSaving(true);
        try {
            await onSave({ email: emailValue.trim(), phone: phoneValue.trim() });
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8'>
            <div className='flex items-start gap-4'>
                <div
                    className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500'
                    aria-hidden='true'
                >
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt='Profilbild'
                            className='h-10 w-10 rounded-full object-cover'
                        />
                    ) : (
                        <UserIcon size={20} weight='fill' className='text-white' />
                    )}
                </div>

                <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-lg font-semibold'>Mina uppgifter</h2>
                        <Button variant='danger' size='md' onClick={() => signOut()}>
                            Logga ut
                        </Button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} noValidate className='mt-5 flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-neutral-700'>
                                    E-postadress
                                </label>
                                <input
                                    type='email'
                                    value={emailValue}
                                    onChange={(e) => setEmailValue(e.target.value)}
                                    className={inputClass}
                                    placeholder='din@email.se'
                                />
                                {emailError && (
                                    <p className='text-xs text-red-600'>{emailError}</p>
                                )}
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-neutral-700'>
                                    Telefonnummer
                                </label>
                                <input
                                    type='tel'
                                    value={phoneValue}
                                    onChange={(e) => setPhoneValue(e.target.value)}
                                    className={inputClass}
                                    placeholder='070-123 45 67'
                                />
                                {phoneError && (
                                    <p className='text-xs text-red-600'>{phoneError}</p>
                                )}
                            </div>

                            <label className='flex flex-col gap-1 text-sm font-medium text-neutral-700'>
                                <span>Profilbild</span>
                                <input
                                    type='file'
                                    accept='image/png,image/jpeg,image/webp'
                                    onChange={onAvatarUpload}
                                    className={inputClass}
                                />
                            </label>

                            <div className='flex gap-3'>
                                <Button type='submit' variant='primary' size='md' disabled={isSaving}>
                                    {isSaving ? 'Sparar...' : 'Spara'}
                                </Button>
                                <Button
                                    type='button'
                                    variant='secondary'
                                    size='md'
                                    onClick={cancel}
                                    disabled={isSaving}
                                >
                                    Avbryt
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className='mt-5 space-y-1 text-sm leading-6 text-gray-700'>
                                {name && <p>{name}</p>}
                                {email && <p>{email}</p>}
                                {phone && <p>{phone}</p>}
                                {!name && !email && !phone && (
                                    <p className='text-gray-600'>
                                        Inga personuppgifter tillgängliga.
                                    </p>
                                )}
                            </div>
                            <div className='mt-6'>
                                <Button variant='primary' size='md' onClick={startEditing}>
                                    Ändra uppgifter
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PersonalInfoSection;
