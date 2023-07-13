import "./videoPopoutItem.css"

export const VideoPopoutItem = ({title, icon, onClick, value}) => {
    return (
        <div className={`video-popout-item`} onClick={onClick}>
            <div className={"video-popout-title"}>
                {icon && <div className={"video-popout-item-icon"}>{icon}</div>}
                {title}
            </div>
            <div className={"video-popout-value"}>{value}</div>
        </div>
    )
}