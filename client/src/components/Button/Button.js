import "./button.css"

export const Button = ({className, children, ...restProps}) => {
    return (
        <button {...restProps} className={`btn ${className}`}>{children}</button>
    )
}