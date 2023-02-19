import {Header} from "../Header/Header";
import {Navigation} from "../Navigation/Navigation";
import {PageView} from "../PageView/PageView";
import {Outlet} from "react-router";

export const Layout = () => {
    return (
        <>
            <Header/>
            <Navigation/>
            <PageView>
                <Outlet/>
            </PageView>
        </>
    )
}