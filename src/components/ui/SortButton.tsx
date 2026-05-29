import { type ReactNode } from 'react';
import { CaretUpIcon, CaretDownIcon } from '@phosphor-icons/react';

const SortButton = ({ onClick, children, value, isActive }: { onClick: () => void; children: ReactNode; value: string; isActive: boolean }) => {
    const direction = value.split(':')[1]

    return (
        <button
            type="button"
            className="flex items-center gap-0.5 text-sm font-bold text-gray-700 cursor-pointer hover:underline"
            onClick={onClick} 
            value={value}
        >
            {children} 
            <span className="text-xs inline-flex w-3 h-3">
                {isActive && (direction === 'asc' ? <CaretUpIcon /> : <CaretDownIcon />)}
            </span>
        </button>
    );
}

export default SortButton