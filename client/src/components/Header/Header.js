import "./header.css"
import {Icon24Search} from "@vkontakte/icons";
import {AccountButton} from "../AccountButton/AccountButton";
import {useCallback, useEffect, useRef, useState} from "react";
import {SEARCH} from "../../consts/pages";
import {NavLink} from "react-router-dom";
import {useParams} from "react-router";

export const Header = () => {
    const [value, setValue] = useState("")
    const ref = useRef(null)
    const {query} = useParams()

    const onSearch = useCallback(() => {
        if (value.trim()) {
            ref.current.click()
        }
    }, [value])

    useEffect(() => {
        query && setValue(query)
    }, [query])

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
                                <input value={value} onChange={e => setValue(e.target.value)} placeholder="Введите запрос" type="text" className="header-search-input"/>
                            </form>
                        </div>
                        <button className="header-search-button" type="submit" onClick={onSearch}>
                            <Icon24Search />
                        </button>
                        <NavLink className="hidden" ref={ref} to={`/${SEARCH}/${value}`}></NavLink>
                    </div>
                </div>
                <div className="header-account-button">
                    <AccountButton/>
                </div>
            </div>
        </header>
    )
}