import "./tabItem.css"

export const TabItem = ({text, selected = false, ...restProps}) => {
    return (
        <div className={`tab-item ${selected ? "selected" : ""}`} {...restProps}>
            {text}
        </div>
    )
}