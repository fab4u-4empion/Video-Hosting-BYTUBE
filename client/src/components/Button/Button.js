import "./button.css"

export const Button = ({className, children, icon, mode="primary", fit = false, ...restProps}) => {
    return (
        <button {...restProps} className={`btn ${className} ${mode} ${fit ? 'fit' : ""}`}>
            {icon && icon}
            {children}
        </button>
    )
}