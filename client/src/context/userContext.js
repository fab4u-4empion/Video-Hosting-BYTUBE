import {createContext, useContext, useEffect} from "react";
import {useSessionStorage} from "../hooks/useSessionStorage";
import {API} from "../api/api";

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
        API.auth
            .request({
                method: "post",
                url: "/account",
                withCredentials: true
            })
            .then(response => {
                setUser(response.data)
            })
            .finally(() => {
                callback && callback()
            })
    }

    const logOut = () => {
        API.auth
            .request({
                method: "post",
                url: "/logout",
                withCredentials: true
            })
            .then(() => {
                setUser(null)
            })
            .catch(() => {
                alert("Не удалось выполнить запрос")
            })
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <Context.Provider value={{
            user,
            authHandler,
            logOut
        }}>
            {children}
        </Context.Provider>
    )
}