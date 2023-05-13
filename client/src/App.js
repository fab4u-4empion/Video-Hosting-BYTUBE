import {UserContextProvider} from "./context/userContext";
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {Layout} from "./components/Layout/Layout";
import {SUBSCRIPTIONS, HISTORY, VIDEOS, ACCOUNT, VIDEO, CHANEL, SEARCH, LIKES} from "./consts/pages";
import {Videos} from "./pages/Videos/Videos";
import {VideoPage} from "./pages/Video/VideoPage";
import {Home} from "./pages/Home/Home";
import {History} from "./pages/History/History";
import {Account} from "./pages/Account/Account";
import {ChannelPage} from "./pages/Channel/ChannelPage";
import {Subscriptions} from "./pages/Subscriptions/Subscriptions";
import {SearchPage} from "./pages/Search/SearchPage";
import {Likes} from "./pages/Likes/Likes";

export const App = () => {
    return (
        <BrowserRouter>
            <UserContextProvider>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Home/>}/>
                        <Route path={SUBSCRIPTIONS} element={<Subscriptions/>}/>
                        <Route path={HISTORY} element={<History/>}/>
                        <Route path={VIDEOS} element={<Videos/>}/>
                        <Route path={ACCOUNT} element={<Account/>}/>
                        <Route path={LIKES} element={<Likes/>}/>
                        <Route path={`${VIDEO}/:id`} element={<VideoPage/>}/>
                        <Route path={`${CHANEL}/:id`} element={<ChannelPage/>}/>
                        <Route path={`${SEARCH}/:query`} element={<SearchPage/>}/>
                    </Route>
                </Routes>
            </UserContextProvider>
        </BrowserRouter>
    )
}