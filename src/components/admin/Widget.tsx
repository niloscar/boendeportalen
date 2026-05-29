import { ArrowsOutSimpleIcon } from "@phosphor-icons/react"
import type { WidgetProps } from '../../types/features'

export default function Widget({ title, slug, description, children, onExpand }: WidgetProps) {
    return (
        <section className="p-4 border border-gray-200 bg-white shadow-md rounded-2xl w-full flex flex-col gap-3 relative">
            
            <figure className="bg-gray-200 h-20 rounded-tl-xl rounded-tr-xl flex items-center justify-center -m-4 mb-0 overflow-hidden">
                <img alt={title} src={`/widgetimg/${slug}.png`} className="h-full w-full object-cover" />
            </figure>

            <h2 className="text-xl font-semibold">{title}</h2>
            {description && <p className="text-gray-600 text-sm">{description}</p>}
            {children}
            <button 
                aria-label="Expandera" 
                className='absolute top-2 right-2 bg-neutral-100 opacity-75 border-0 cursor-pointer text-neutral-600 p-1 rounded-lg hover:text-neutral-600 hover:opacity-100 transition-opacity' 
                onClick={onExpand}
            >
                <ArrowsOutSimpleIcon size={20} />
            </button>
        </section>
    )
}