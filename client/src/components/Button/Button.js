import "./button.css"

export const Button = ({className, children, icon, ...restProps}) => {
    return (
        <button {...restProps} className={`btn ${className}`}>
            {icon && icon}
            {children}
        </button>
    )
}