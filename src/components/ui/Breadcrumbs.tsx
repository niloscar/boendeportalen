import { Link } from 'react-router-dom'
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
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <ol>
                {crumbs.map((crumb, index) => {
                    const isCurrent = index === crumbs.length - 1 // Last provided crumb is the current page

                    return (
                        <li key={`${crumb.title}-${index}`}>
                            {index > 0 && '<span aria-hidden="true">→</span>'}
                            {/* If breadcrumb has an href and is not the current page, render as a link */}
                            {/* Otherwise, render as plain text (and apply current page styling if it's the last crumb) */}
                            {crumb.href && !isCurrent 
                                ? <Link to={crumb.href} className={styles.link}>{crumb.title}</Link>
                                : <span 
                                    className={isCurrent ? styles.current : undefined}
                                    aria-current={isCurrent ? 'page' : undefined}
                                    >{crumb.title}</span>}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}