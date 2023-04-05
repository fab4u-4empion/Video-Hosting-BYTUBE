import {UserContextProvider} from "./context/userContext";
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {Layout} from "./components/Layout/Layout";
import {Page} from "./components/Page/Page";
import {SUBSCRIPTIONS, HISTORY, VIDEOS, ACCOUNT, VIDEO} from "./consts/pages";
import {Videos} from "./pages/Videos/Videos";
import {VideoPage} from "./pages/Video/VideoPage";
import {Home} from "./pages/Home/Home";
import {History} from "./pages/History/History";
import {Account} from "./pages/Account/Account";

export const App = () => {
    return (
        <BrowserRouter>
            <UserContextProvider>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Home/>}/>
                        <Route path={SUBSCRIPTIONS} element={<Page title="Подписки"></Page>}/>
                        <Route path={HISTORY} element={<History/>}/>
                        <Route path={VIDEOS} element={<Videos/>}/>
                        <Route path={ACCOUNT} element={<Account/>}/>
                        <Route path={`${VIDEO}/:id`} element={<VideoPage/>}/>
                    </Route>
                </Routes>
            </UserContextProvider>
        </BrowserRouter>
    )
}