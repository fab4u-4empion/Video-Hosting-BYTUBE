import "./input.css"

export const Input = ({className, ...restProps}) => {
    return (
        <div className="input-wrapper">
            <input className={`input ${className}`} {...restProps}/>
        </div>
    )
}