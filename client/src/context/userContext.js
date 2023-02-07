import {createContext, useContext} from "react";
import {useLocalStorage} from "../hooks/useLocalStorage";

const Context = createContext(undefined, undefined)

export const useUserContextProvider = () => {
    return useContext(Context)
}

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useLocalStorage(null, "user")

    return (
        <Context.Provider value={{

        }}>
            {children}
        </Context.Provider>
    )
}