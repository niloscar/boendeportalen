import { ArrowsOutSimpleIcon } from "@phosphor-icons/react"
import type { WidgetProps } from '../../types/features'

export default function Widget({ title, description, children, onExpand }: WidgetProps) {
    return (
        <section className="p-4 border border-gray-200 bg-white shadow-md rounded-2xl w-full flex flex-col gap-3 relative">
            <h2 className="text-xl font-semibold">{title}</h2>
            {description && <p className="text-gray-600 text-sm">{description}</p>}
            {children}
            <button 
                aria-label="Expandera" 
                className='absolute top-2 right-2 bg-transparent border-0 cursor-pointer text-neutral-400 p-1 rounded-lg hover:bg-neutral-100 hover:text-neutral-600' 
                onClick={onExpand}
            >
                <ArrowsOutSimpleIcon size={20} />
            </button>
        </section>
    )
}