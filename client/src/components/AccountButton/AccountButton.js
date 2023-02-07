import "./accountButton.css"
import {useUserContextProvider} from "../../context/userContext";
import {useState} from "react";
import {SignInModal} from "../SignInModal/SignInModal";

export const AccountButton = () => {
    const {user} = useUserContextProvider()
    const [modal, setModal] = useState(null)

    return (
        <>
            {!user &&
                <button
                    className="header-sign-in-button"
                    onClick={() => setModal(<SignInModal onClose={() => setModal(null)}/>)}
                >
                    Войти
                </button>
            }
            {modal}
        </>
    )
}