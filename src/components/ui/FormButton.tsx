import { 
    type ReactNode, 
    type ButtonHTMLAttributes 
} from 'react'

export default function FormButton({ type, children }: { 
    type: ButtonHTMLAttributes<HTMLButtonElement>['type']; 
    children: ReactNode 
}) {

    const classNames = [
        'px-4',
        'py-2',
        'bg-neutral-900',
        'text-white',
        'font-semibold',
        'rounded-2xl',
        'hover:bg-neutral-800',
        'cursor-pointer',
        'transition',
        'duration-200'
    ].join(' ')

    return (
        <button 
            type={type} 
            className={classNames}>
            {children}
        </button>
    )
}