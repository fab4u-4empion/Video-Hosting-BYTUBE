import "./modal.css"
import {Icon28CancelOutline} from "@vkontakte/icons";
import {useEffect} from "react";

export const Modal = ({onClose, children, width}) => {
    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {document.body.style.overflow = "visible"}
    },[])

    return (
        <div className="modal-wrapper" onClick={onClose}>
            <div className="modal" style={{width: width}} onClick={e => e.stopPropagation()}>
                <div className="modal-dismiss">
                    <button onClick={onClose} className="modal-dismiss-button">
                        <Icon28CancelOutline/>
                    </button>
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    )
}