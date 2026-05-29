import type { PaginationProps } from '../../types/pagination'

const getPageItems = (total: number, current: number) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    const pages: Array<number | null> = []
    pages.push(1)

    const left = Math.max(2, current - 1)
    const right = Math.min(total - 1, current + 1)

    if (left > 2) pages.push(null)
    for (let p = left; p <= right; p++) pages.push(p)
    if (right < total - 1) pages.push(null)

    pages.push(total)
    return pages
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    return (
        <nav className="mt-6 flex items-center gap-2" aria-label="Pagination">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl border border-green-500 ${currentPage === 1 ? 'text-green-500 border-gray-200' : 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'}`}
            >
                Föregående
            </button>

            <div className="flex items-center gap-2">
                {getPageItems(totalPages, currentPage).map((item, idx) => (
                    item === null ? (
                        <span key={`ell-${idx}`} className="px-4 py-2 text-gray-500">…</span>
                    ) : (
                        <button
                            key={item}
                            onClick={() => onPageChange(item)}
                            aria-current={item === currentPage ? 'page' : undefined}
                            className={`px-4 py-2 rounded-xl border border-green-500 ${item === currentPage ? 'bg-green-500 text-white' : 'bg-white text-green-600 hover:bg-green-100 cursor-pointer'}`}
                        >
                            {item}
                        </button>
                    )
                ))}
            </div>

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl border border-green-500 ${currentPage === totalPages ? 'text-gray-400 border-gray-200' : 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'}`}
            >
                Nästa
            </button>
        </nav>
    )
}
