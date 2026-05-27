import { Link } from 'react-router-dom'
import { CaretRightIcon } from '@phosphor-icons/react'

type Crumb = {
    title: string
    href?: string
}

type BreadcrumbsProps = {
    crumbs: Crumb[]
}

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
    return (
        <nav
            className="w-fit self-center px-4 py-2 text-sm text-neutral-500"
            aria-label="Breadcrumb"
        >
            <ol className="flex items-center gap-1">
                {crumbs.map((crumb, index) => {
                    const isCurrent = index === crumbs.length - 1

                    return (
                        <li
                            key={`${crumb.title}-${index}`}
                            className="flex items-center gap-1"
                        >
                            {index > 0 && <CaretRightIcon size={16} aria-hidden="true" focusable="false" />}

                            {crumb.href && !isCurrent ? (
                                <Link
                                    to={crumb.href}
                                    className="text-neutral-500 hover:text-neutral-700 hover:underline"
                                >
                                    {crumb.title}
                                </Link>
                            ) : (
                                <span
                                    className={isCurrent ? 'font-medium text-neutral-900' : undefined}
                                    aria-current={isCurrent ? 'page' : undefined}
                                >
                                    {crumb.title}
                                </span>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
