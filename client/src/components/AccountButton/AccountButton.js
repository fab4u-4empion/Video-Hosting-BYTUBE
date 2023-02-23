import "./accountButton.css"
import {useUserContextProvider} from "../../context/userContext";
import {useState} from "react";
import {SignInModal} from "../SignInModal/SignInModal";
import {Avatar} from "../Avatar/Avatar";
import {Icon20ChevronRight} from "@vkontakte/icons";
import {NavLink} from "react-router-dom";
import {ACCOUNT} from "../../consts/pages";
import {Button} from "../Button/Button";

export const AccountButton = () => {
    const {user} = useUserContextProvider()
    const [modal, setModal] = useState(null)

    return (
        <>
            {!user &&
                <Button
                    className="header-sign-in-button"
                    onClick={() => setModal(<SignInModal onClose={() => setModal(null)}/>)}
                >
                    Войти
                </Button>
            }
            {user &&
                <NavLink to={`/${ACCOUNT}`} className="header-account-button-content">
                    <Avatar
                        size={35}
                    />
                    <div className="header-account-button-text">{user["u_name"]}</div>
                    <div><Icon20ChevronRight/></div>
                </NavLink>
            }
            {modal}
        </>
    )
}