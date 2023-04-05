import "./avatar.css"
import {Icon28UserOutline} from "@vkontakte/icons";
import {useEffect, useState} from "react";
import axios from "axios";

export const Avatar = ({src, size = 20, overlay, dataURLContent = false}) => {
    const [loaded, setLoaded] = useState(false)
    const [failed, setFailed] = useState(false)

    const needFallBack = failed || !src

    const handleImageLoad = () => {
        setLoaded(true)
        setFailed(false)
    }

    const handleImageError = () => {
        setLoaded(false)
        setFailed(true)
    }

    return (
        <div
            className={`avatar-container ${loaded ? "avatar-loaded" : ""}`}
            style={{width: size, height: size}}
        >
            {overlay &&
                <div className="avatar-overlay" onClick={overlay.action}>{overlay.icon}</div>
            }
            {src &&
                <img
                    src={src}
                    className="avatar-img"
                    width={size}
                    height={size}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
            }
            {needFallBack &&
                <div className="avatar-fallback"><Icon28UserOutline width={size * 0.75} height={size * 0.75}/></div>
            }
        </div>
    )
}