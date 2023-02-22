import "./inputControls.css"

export const Input = ({className, ...restProps}) => {
    return (
        <div className="input-control-wrapper input-wrapper">
            <input className={`input ${className}`} {...restProps}/>
        </div>
    )
}