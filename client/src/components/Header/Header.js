import "./header.css"
import {Icon24Search} from "@vkontakte/icons";
import {AccountButton} from "../AccountButton/AccountButton";

export const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="header-logo">
                    <span className="red">B</span><span className="green">Y</span>TUBE
                </div>
                <div className="header-search">
                    <div className="header-search-group">
                        <div className="header-search-form">
                            <form className="" onSubmit={(e) => e.preventDefault()}>
                                <input placeholder="Введите запрос" type="text" className="header-search-input"/>
                            </form>
                        </div>
                        <button className="header-search-button">
                            <Icon24Search />
                        </button>
                    </div>
                </div>
                <div className="header-account-button">
                    <AccountButton />
                </div>
            </div>
        </header>
    )
}