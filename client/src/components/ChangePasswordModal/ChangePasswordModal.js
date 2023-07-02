import {Modal} from "../Modal/Modal";
import "./changePasswordModal.css"
import {Input} from "../InputControls/Input";
import {Button} from "../Button/Button";
import {useState} from "react";
import axios from "axios";
import {API} from "../../api/api";

export const ChangePasswordModal = ({onClose, onSuccess}) => {
    const [errorMessage, setErrorMessage] = useState("")
    const [disabled, setDisabled] = useState(false)

    const onChangePassword = e => {
        e.preventDefault()
        setDisabled(true)
        setErrorMessage("")
        API.auth
            .request({
                method: "post",
                url: "/changePassword",
                data: new FormData(document.forms['changePassword']),
                withCredentials: true
            })
            .then(response => {
                onClose()
                onSuccess()
            })
            .catch(err => {
                if (err.response.status === 400)
                    setErrorMessage(err.response.data)
                else
                    alert("Не удалось выполнить запрос")
                setDisabled(false)
            })
    }

    const changeHandler = () => {
        setErrorMessage("")
    }

    return (
        <Modal
            title="Изменение пароля"
            onClose={onClose}
            width={400}
        >
            <div className="change-password-modal-content">
                <form name="changePassword" className="change-password-modal-form">
                    <Input onChange={changeHandler} name="oldPassword" type="password" placeholder="Старый пароль"/>
                    <Input onChange={changeHandler} name="newPassword" type="password" placeholder="Новый пароль"/>
                    <div className="change-password-modal-error">{errorMessage}</div>
                    <Button disabled={disabled} onClick={onChangePassword}>Изменить пароль</Button>
                </form>
            </div>
        </Modal>
    )
}