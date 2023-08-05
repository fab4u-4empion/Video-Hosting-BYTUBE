import "./button.css"

export const Button = ({className, children, icon, size = "regular", mode="primary", fit = false, outline = true, ...restProps}) => {
    return (
        <button {...restProps} className={`btn ${className} ${mode} ${size} ${fit ? 'fit' : ""} ${outline ? '' : "no-outline"}`}>
            {icon && icon}
            {children}
        </button>
    )
}