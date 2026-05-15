import { Fragment } from 'react'
import styles from './Breadcrumbs.module.css'

type Crumb = {
    title: string
    href?: string
}

type BreadcrumbsProps = {
    crumbs: Crumb[]
}

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
    return (
        <nav className={styles.breadcrumbs}>
            {crumbs.map((crumb, index) => {
                const isCurrent = index === crumbs.length - 1 // Last provided crumb is the current page

                return (
                    <Fragment key={`${crumb.title}-${index}`}>
                        {index > 0 && ' → '}
                        {crumb.href && !isCurrent 
                            ? <a href={crumb.href} className={styles.link}>{crumb.title}</a> // If it has an href and is not the current page, render as a link
                            : <span className={isCurrent ? styles.current : undefined}>{crumb.title}</span>} // Otherwise, render as plain text (and apply current page styling if it's the last crumb)
                    </Fragment>
                )
            })}
        </nav>
    )
}