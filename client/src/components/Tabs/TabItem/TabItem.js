import "./tabItem.css"

export const TabItem = ({text, selected = false, mode = "underline", ...restProps}) => {
    return (
        <div className={`tab-item ${selected ? "selected" : ""} ${mode}`} {...restProps}>
            {text}
        </div>
    )
}