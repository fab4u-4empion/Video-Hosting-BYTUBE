import "./modal.css"
import {Icon28CancelOutline} from "@vkontakte/icons";
import {useEffect} from "react";

export const Modal = ({onClose, children, width, footer = null, title = ""}) => {
    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {document.body.style.overflow = "visible"}
    },[])

    return (
        <div className="modal-wrapper">
            <div className="modal" style={{width: width}}>
                <div className="modal-dismiss">
                    <button onClick={onClose} className="modal-dismiss-button">
                        <Icon28CancelOutline/>
                    </button>
                </div>
                <div className="modal-title">{title}</div>
                <div className="modal-content">
                    {children}
                </div>
                <div className="modal-footer">
                    {footer}
                </div>
            </div>
        </div>
    )
}