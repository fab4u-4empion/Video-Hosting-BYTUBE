import {Modal} from "../Modal/Modal";
import {useState} from "react";
import "./signInModal.css"

const SIGN_IN = "signIn"
const SIGN_UP = "signUp"

export const SignInModal = ({onClose}) => {
    const [mode, setMode] = useState(SIGN_IN)

    return (
        <Modal onClose={onClose} width={400}>
            {mode === SIGN_IN &&
                <div className="sign-in-modal-content">
                    <h1 className="sign-in-modal-title">Вход</h1>
                    <form className="sign-in-modal-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="sign-in-modal-input-wrapper">
                            <input className="sign-in-modal-input" placeholder="Имя пользователя" type="text"/>
                        </div>
                        <div className="sign-in-modal-input-wrapper">
                            <input className="sign-in-modal-input" placeholder="Пароль" type="password"/>
                        </div>
                        <button className="sign-in-modal-submit-button">Войти</button>
                    </form>
                    <div className="sign-in-modal-separator"></div>
                    <div className="sign-in-modal-footer">
                        <div>Еще нет аккаунта?</div>
                        <div className="sign-in-modal-footer-button" onClick={() => setMode(SIGN_UP)}>Зарегистрироваться</div>
                    </div>
                </div>
            }
            {mode === SIGN_UP &&
                <div className="sign-in-modal-content">
                    <h1 className="sign-in-modal-title">Регистрация</h1>
                    <form className="sign-in-modal-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="sign-in-modal-input-wrapper">
                            <input className="sign-in-modal-input" placeholder="Придумайте имя" type="text"/>
                        </div>
                        <div className="sign-in-modal-input-wrapper">
                            <input className="sign-in-modal-input" placeholder="Придумайте пароль" type="password"/>
                        </div>
                        <div className="sign-in-modal-input-wrapper">
                            <input className="sign-in-modal-input" placeholder="Повторите пароль" type="password"/>
                        </div>
                        <button className="sign-in-modal-submit-button">Создать аккаунт</button>
                    </form>
                    <div className="sign-in-modal-separator"></div>
                    <div className="sign-in-modal-footer">
                        <div>Уже есть аккаунт?</div>
                        <div className="sign-in-modal-footer-button" onClick={() => setMode(SIGN_IN)}>Войти</div>
                    </div>
                </div>
            }
        </Modal>
    )
}