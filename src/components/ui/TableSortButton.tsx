import { type ReactNode } from 'react';
import styles from './TableSortButton.module.css'

const TableSortButton = ({ onClick, children, value, isActive }: { onClick: () => void; children: ReactNode; value: string; isActive: boolean }) => {
    const direction = value.split(':')[1]

    const classNames = [
        'text-sm',
        'font-medium',
        'text-gray-700',
        'cursor-pointer',
        'hover:underline',
        isActive && 'underline'
    ]

    return (
        <button
            className={classNames.join(' ')}
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

export default TableSortButton