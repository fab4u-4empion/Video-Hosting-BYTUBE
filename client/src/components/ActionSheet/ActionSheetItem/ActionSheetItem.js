import "./actionSheetItem.css"

export const ActionSheetItem = ({children, mode="primary", icon, action}) => {
    return (
        <div className={`action-sheet-item ${mode}`} onClick={action}>
            {icon && <div className={"action-sheet-item-icon"}>{icon}</div>}
            {children}
        </div>
    )
}