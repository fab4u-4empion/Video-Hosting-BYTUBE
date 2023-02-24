import "./page.css"

export const Page = ({children, title, actions, ...restProps}) => {
    return (
        <div {...restProps}>
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">{title}</div>
                    <div className="page-actions">{actions}</div>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}