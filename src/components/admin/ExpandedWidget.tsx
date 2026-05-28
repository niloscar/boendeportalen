import { ArrowsInSimpleIcon } from "@phosphor-icons/react"

export default function ExpandedWidget({ title, slug, description, onClose, children }: { title: string, slug: string, description: string | null, onClose: () => void, children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start md:items-center justify-center p-6">
            <div className="bg-white rounded-2xl w-full max-w-6xl p-6 relative">
                <figure className="bg-gray-200 h-20 rounded-tl-xl rounded-tr-xl flex items-center justify-center -m-6 mb-6 overflow-hidden">
                    <img alt={title} src={`/widgetimg/${slug}.png`} className="w-full h-auto object-cover" />
                </figure>

                <button
                    aria-label="Stäng"
                    className='absolute top-2 right-2 bg-neutral-100 opacity-75 border-0 cursor-pointer text-neutral-600 p-1 rounded-lg hover:text-neutral-600 hover:opacity-100 transition-opacity' 
                    onClick={onClose}
                >
                    <ArrowsInSimpleIcon size={20} />
                </button>
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                {description && <p className="text-gray-600 mb-4">{description}</p>}
                <div className="max-h-[70vh] flex flex-col gap-3">
                    {children}
                </div>
            </div>
        </div>
    )
}