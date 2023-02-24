import "./iconbutton.css"

export const IconButton = ({children, ...restProps}) => {
    return (
        <button className="icon-button" {...restProps}>
            {children}
        </button>
    )
}