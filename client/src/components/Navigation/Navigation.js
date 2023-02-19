import "./navigation.css"
import {
    Icon28HistoryForwardOutline,
    Icon28HomeOutline,
    Icon28UserAddOutline,
    Icon28VideoSquareOutline
} from "@vkontakte/icons";
import {HISTORY, HOME, SUBSCRIPTIONS, VIDEOS} from "../../consts/pages";
import {NavLink} from "react-router-dom";

const navItems = [
    {
        text: "Главная",
        icon: <Icon28HomeOutline />,
        page: HOME
    },
    {
        text: "Подписки",
        icon: <Icon28UserAddOutline />,
        page: SUBSCRIPTIONS
    },
    {
        text: "История",
        icon: <Icon28HistoryForwardOutline />,
        page: HISTORY
    },
    {
        text: "Ваши видео",
        icon: <Icon28VideoSquareOutline />,
        page: VIDEOS
    },
]

export const Navigation = () => {
    return(
        <div className="nav-wrapper">
            <div className="nav-spacer"></div>
            <div className="nav-content">
                <nav className="nav">
                    <div className="nav-list">
                        {navItems.map(item =>
                            <NavLink
                                className="nav-list-link"
                                key={item.page}
                                to={`/${item.page}`}
                            >
                                {item.icon}
                                <div>{item.text}</div>
                            </NavLink>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    )
}