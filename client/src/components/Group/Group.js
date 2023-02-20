import "./group.css"

export const Group = ({className, children, title, subtitle, ...restProps}) => {
    return (
        <div className={`group ${className}`} {...restProps}>
            {title && <div className="group-title">{title}</div>}
            {subtitle && <div className="group-subtitle">{subtitle}</div>}
            <div className="group-content">{children}</div>
        </div>
    )
}