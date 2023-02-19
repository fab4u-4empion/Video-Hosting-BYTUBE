import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import {useSessionStorage} from "../hooks/useSessionStorage";

const Context = createContext(undefined, undefined)

export const useUserContextProvider = () => {
    return useContext(Context)
}

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useSessionStorage(null, "user")

    const authHandler = (callback) => {
        getUser(callback)
    }

    const getUser = (callback) => {
        axios
            .post(
                "https://localhost:3000/api/v1/auth/account",
                {},
                {withCredentials: true}
            )
            .then(response => {
                setUser(response.data)
            })
            .finally(() => {
                callback && callback()
            })
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <Context.Provider value={{
            user,
            authHandler
        }}>
            {children}
        </Context.Provider>
    )
}