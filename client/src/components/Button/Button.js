import "./button.css"

export const Button = ({className, children, icon, size = "regular", mode="primary", fit = false, ...restProps}) => {
    return (
        <button {...restProps} className={`btn ${className} ${mode} ${size} ${fit ? 'fit' : ""}`}>
            {icon && icon}
            {children}
        </button>
    )
}