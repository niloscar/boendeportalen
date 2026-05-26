import { ArrowsInSimpleIcon } from "@phosphor-icons/react"

export default function ExpandedWidget({ widgetSlug, description, onClose, children }: { widgetSlug: string, description: string | null, onClose: () => void, children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start md:items-center justify-center p-6">
            <div className="bg-white rounded-2xl w-full p-6 relative">
                <button
                    aria-label="Stäng"
                    className="absolute top-4 right-4 bg-transparent border-0 cursor-pointer text-neutral-400 p-1 rounded-lg hover:bg-neutral-100 hover:text-neutral-600"
                    onClick={onClose}
                >
                    <ArrowsInSimpleIcon size={20} />
                </button>
                <h2 className="text-2xl font-bold mb-2">{widgetSlug}</h2>
                {description && <p className="text-gray-600 mb-4">{description}</p>}
                <div className="max-h-[70vh] flex flex-col gap-3">
                    {children}
                </div>
            </div>
        </div>
    )
}