import { type ReactNode } from 'react';
import styles from './SortButton.module.css'

const SortButton = ({ onClick, children, value, isActive }: { onClick: () => void; children: ReactNode; value: string; isActive: boolean }) => {
    const direction = value.split(':')[1]

    const classNames = [
        'text-sm',
        'font-medium',
        'text-gray-700',
        'cursor-pointer',
        'hover:underline',
        isActive && 'underline'
    ].filter(Boolean).join(' ')

    return (
        <button
            className={classNames}
            onClick={onClick} 
            value={value}
        >
            {children} 
            <span className={`text-xs ${styles['sort-order']}`}>
                {isActive && (direction === 'asc' ? '↑' : '↓')}
            </span>
        </button>
    );
}

export default SortButton