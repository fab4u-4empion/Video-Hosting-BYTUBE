import "./videoPopoutItem.css"
import {Icon24DoneOutline} from "@vkontakte/icons";

export const VideoPopoutSelectableItem = ({selected, onClick, value}) => {
    return (
        <div className={`video-popout-item`} onClick={onClick}>
            <div className={"video-popout-item-icon"}>
                {selected && <Icon24DoneOutline/>}
            </div>
            <div>{value}</div>
        </div>
    )
}