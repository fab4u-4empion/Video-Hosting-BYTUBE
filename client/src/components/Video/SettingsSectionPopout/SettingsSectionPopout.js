import {VideoPopout} from "../VideoPopout/VideoPopout";
import "./settingsSectionPopout.css"
import {Icon24ChevronLeftOutline} from "@vkontakte/icons";

export const SettingsSectionPopout = ({show, children, title, width, onBack}) => {
    return (
        <VideoPopout
            show={show}
            width={width}
        >
            <div className={"video-popout-back-button"} onClick={onBack}>
                <Icon24ChevronLeftOutline/>
                <div>{title}</div>
            </div>
            <div className={"video-popout-separator"}></div>
            {children}
        </VideoPopout>
    )
}