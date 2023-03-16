import "./button.css"

export const Button = ({className, children, icon, mode="primary", ...restProps}) => {
    return (
        <button {...restProps} className={`btn ${className} ${mode}`}>
            {icon && icon}
            {children}
        </button>
    )
}