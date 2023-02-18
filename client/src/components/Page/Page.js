import "./page.css"

export const Page = ({children, title, ...restProps}) => {
    return (
        <div {...restProps}>
            <div className="page-content">
                <div className="page-title">{title}</div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}