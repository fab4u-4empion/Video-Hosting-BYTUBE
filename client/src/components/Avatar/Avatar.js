import "./avatar.css"
import {Icon28UserOutline} from "@vkontakte/icons";
import {useEffect, useState} from "react";
import axios from "axios";

export const Avatar = ({src, size = 20, overlay}) => {
    const [imgURL, setImgURL] = useState(null)

    useEffect(() => {
        axios
            .get(src, {responseType: "blob"})
            .then(response => {
                const r = new FileReader()
                r.readAsDataURL(response.data)
                r.onload = () => {
                    setImgURL(r.result)
                }
            })
    }, [])

    return (
        <div className="avatar-container" style={{width: size, height: size}}>
            {overlay &&
                <div className="avatar-overlay">{overlay}</div>
            }
            {!imgURL &&
                <div className="avatar-icon"><Icon28UserOutline width={size * 0.75} height={size * 0.75}/></div>
            }
            {imgURL &&
                <img
                    src={imgURL}
                    className="avatar-img"
                    width={size}
                    height={size}
                />
            }
        </div>
    )
}