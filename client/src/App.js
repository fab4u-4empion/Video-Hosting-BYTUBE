import {Navigation} from "./components/Navigation/Navigation";
import {Header} from "./components/Header/Header";
import {useState} from "react";
import {UserContextProvider} from "./context/userContext";

const HOME = "home"

export const App = () => {
    const [activePage, setActivePage] = useState(HOME)

    return (
        <UserContextProvider>
            <Header/>
            <Navigation
                activePage={activePage}
                onPageSelect={page => setActivePage(page)}
            />
        </UserContextProvider>
    )
}