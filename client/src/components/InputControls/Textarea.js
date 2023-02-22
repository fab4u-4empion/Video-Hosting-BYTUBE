import "./inputControls.css"

export const Textarea = ({className, ...restProps}) => {
    return (
        <div className="input-control-wrapper textarea-wrapper">
            <textarea rows={7} className={`input textarea ${className}`} {...restProps}/>
        </div>
    )
}