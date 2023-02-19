import {UserContextProvider} from "./context/userContext";
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {Layout} from "./components/Layout/Layout";
import {Page} from "./components/Page/Page";
import {SUBSCRIPTIONS, HISTORY, VIDEOS, ACCOUNT} from "./consts/pages";

export const App = () => {
    return (
        <BrowserRouter>
            <UserContextProvider>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Page title="Главная"></Page>}/>
                        <Route path={SUBSCRIPTIONS} element={<Page title="Подписки"></Page>}/>
                        <Route path={HISTORY} element={<Page title="История"></Page>}/>
                        <Route path={VIDEOS} element={<Page title="Ваши видео"></Page>}/>
                        <Route path={ACCOUNT} element={<Page title="Аккаунт"></Page>}/>
                    </Route>
                </Routes>
            </UserContextProvider>
        </BrowserRouter>
    )
}