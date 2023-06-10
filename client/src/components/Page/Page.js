import "./page.css"

export const Page = ({children, title, actions}) => {
    return (
        <div className="page-content">
            {(title || actions) &&
                <div className="page-header">
                    <div className="page-title">{title}</div>
                    <div className="page-actions">{actions}</div>
                </div>
            }
            <>
                {children}
            </>
        </div>
    )
}