import "./accountButton.css"
import {useUserContextProvider} from "../../context/userContext";
import {useState} from "react";
import {SignInModal} from "../SignInModal/SignInModal";
import {Avatar} from "../Avatar/Avatar";
import {Icon20ChevronRight} from "@vkontakte/icons";

export const AccountButton = ({activePage, onPageSelect}) => {
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
            {user &&
                <div
                    onClick={() => onPageSelect("account")}
                    className={`header-account-button-content ${activePage === "account" && "active"}`}
                >
                    <Avatar
                        size={35}
                        src="https://ru-wotp.lesta.ru/dcont/fb/image/9_RShqbeP.jpg"
                    />
                    <div className="header-account-button-text">{user["u_name"]}</div>
                    <div><Icon20ChevronRight/></div>
                </div>
            }
            {modal}
        </>
    )
}