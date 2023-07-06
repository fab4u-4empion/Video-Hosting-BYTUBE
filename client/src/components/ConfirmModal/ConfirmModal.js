import "./confirmModal.css"
import {Button} from "../Button/Button";
import {Modal} from "../Modal/Modal";

export const ConfirmModal = ({onClose, actionName, actionMessage, onAction}) => {
    return (
        <Modal
            title={"Подтвердите действие"}
            width={400}
            onClose={onClose}
        >
            <div className={"confirm-modal-content"}>
                <div className={"confirm-modal-text"}>{actionMessage}</div>
                <div className={"confirm-modal-buttons"}>
                    <Button mode={"secondary"} onClick={onClose}>Отмена</Button>
                    <Button onClick={onAction}>{actionName}</Button>
                </div>
            </div>
        </Modal>
    )
}