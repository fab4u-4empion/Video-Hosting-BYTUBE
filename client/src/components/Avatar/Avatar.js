import "./avatar.css"
import {Icon28UserOutline} from "@vkontakte/icons";

export const Avatar = ({src, size = 20}) => {
    return (
        <div className="avatar-container" style={{width: size, height: size}}>
            {!src &&
                <div className="avatar-icon"><Icon28UserOutline/></div>
            }
            {src &&
                <img
                    src={src}
                    className="avatar-img"
                    width={size}
                    height={size}
                />
            }
        </div>
    )
}