import "./tabs.css"

export const Tabs = ({children, className}) => {
    return (
        <div className={`tabs-container ${className}`}>
            {children}
        </div>
    )
}