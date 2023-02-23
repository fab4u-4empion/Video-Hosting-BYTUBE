import {Modal} from "../Modal/Modal";
import {useContext, useState} from "react";
import axios from "axios"
import "./signInModal.css"
import {useUserContextProvider} from "../../context/userContext";
import {Button} from "../Button/Button";
import {Input} from "../InputControls/Input";

const SIGN_IN = "signIn"
const SIGN_UP = "signUp"

export const SignInModal = ({onClose}) => {
    const [mode, setMode] = useState(SIGN_IN)
    const [disabled, setDisabled] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const {authHandler} = useUserContextProvider()

    const registrationHandler = e => {
        e.preventDefault()
        setDisabled(true)
        setErrorMessage("")
        axios
            .post(
                "https://localhost:3000/api/v1/auth/registration",
                new FormData(document.forms["registration_form"]),
                {withCredentials: true}
            )
            .then(response => {
                authHandler(onClose)
            })
            .catch(err => {
                if (err.response.status === 400)
                    setErrorMessage(err.response.data)
                else
                    setErrorMessage("Ошибка регистрации")
                setDisabled(false)
            })
    }

    const loginHandler = e => {
        e.preventDefault()
        setDisabled(true)
        setErrorMessage("")
        axios
            .post(
                "https://localhost:3000/api/v1/auth/login",
                new FormData(document.forms["login_form"]),
                {withCredentials: true}
            )
            .then(response => {
                authHandler(onClose)
            })
            .catch(err => {
                if (err.response.status === 400)
                    setErrorMessage(err.response.data)
                else
                    setErrorMessage("Ошибка входа")
                setDisabled(false)
            })
    }

    const changeHandler = () => {
        setErrorMessage("")
    }

    return (
        <Modal onClose={onClose} width={400} title={mode === SIGN_IN ? "Вход" : "Регистрация"}>
            {mode === SIGN_IN &&
                <div className="sign-in-modal-content">
                    <form className="sign-in-modal-form" name="login_form" onSubmit={(e) => e.preventDefault()}>
                        <Input className="sign-in-modal-input" onChange={changeHandler} name="u_name" placeholder="Имя пользователя" type="text"/>
                        <Input className="sign-in-modal-input" onChange={changeHandler} name="u_password" placeholder="Пароль" type="password"/>
                        <div className="sign-in-modal-error">{errorMessage}</div>
                        <Button disabled={disabled} className="sign-in-modal-submit-button" onClick={loginHandler}>Войти</Button>
                    </form>
                    <div className="sign-in-modal-separator"></div>
                    <div className="sign-in-modal-footer">
                        <div>Еще нет аккаунта?</div>
                        <div
                            className="sign-in-modal-footer-button"
                            onClick={() => {
                                setMode(SIGN_UP)
                                setErrorMessage("")
                                setDisabled(false)
                            }}
                        >Зарегистрироваться</div>
                    </div>
                </div>
            }
            {mode === SIGN_UP &&
                <div className="sign-in-modal-content">
                    <form className="sign-in-modal-form" name="registration_form" onSubmit={registrationHandler}>
                        <Input className="sign-in-modal-input" name="u_name" onChange={changeHandler} placeholder="Придумайте имя" type="text"/>
                        <Input className="sign-in-modal-input" name="u_password" onChange={changeHandler} placeholder="Придумайте пароль" type="password"/>
                        <Input className="sign-in-modal-input" name="u_confirm_password" onChange={changeHandler} placeholder="Повторите пароль" type="password"/>
                        <div className="sign-in-modal-error">{errorMessage}</div>
                        <Button disabled={disabled} type="submit" className="sign-in-modal-submit-button">Создать аккаунт</Button>
                    </form>
                    <div className="sign-in-modal-separator"></div>
                    <div className="sign-in-modal-footer">
                        <div>Уже есть аккаунт?</div>
                        <div
                            className="sign-in-modal-footer-button"
                            onClick={() => {
                                setMode(SIGN_IN)
                                setErrorMessage("")
                                setDisabled(false)
                            }}
                        >Войти</div>
                    </div>
                </div>
            }
        </Modal>
    )
}