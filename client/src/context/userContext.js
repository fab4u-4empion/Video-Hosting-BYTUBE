import {createContext, useContext, useEffect} from "react";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {useSessionStorage} from "../hooks/useSessionStorage";
import axios from "axios";

const Context = createContext(undefined, undefined)

export const useUserContextProvider = () => {
    return useContext(Context)
}

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useSessionStorage(null, "user")
    const [sessionToken, setSessionToken] = useLocalStorage(null, "token")

    const authHandler = (token, callback) => {
        setSessionToken(token)
        getUser(token, callback)
    }

    const getUser = (token, callback) => {
        axios
            .post("http://localhost:3000/api/v1/auth/account",{},{
                headers: {
                    "Authorization": token
                }
            })
            .then(response => {
                setUser(response.data)
            })
            .finally(() => {
                callback && callback()
            })
    }

    useEffect(() => {
        getUser(sessionToken)
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