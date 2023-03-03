import "./iconbutton.css"

export const IconButton = ({children, className, ...restProps}) => {
    return (
        <button className={`icon-button ${className}`} {...restProps}>
            {children}
        </button>
    )
}