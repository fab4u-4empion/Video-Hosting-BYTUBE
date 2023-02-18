import "./navigation.css"
import {
    Icon28HistoryForwardOutline,
    Icon28HomeOutline,
    Icon28UserAddOutline,
    Icon28VideoSquareOutline
} from "@vkontakte/icons";
import {HISTORY, HOME, SUBSCRIPTIONS, VIDEOS} from "../../consts/pages";

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

export const Navigation = ({activePage = "home", onPageSelect}) => {
    return(
        <div className="nav-wrapper">
            <div className="nav-spacer"></div>
            <div className="nav-content">
                <nav className="nav">
                    <ul className="nav-list">
                        {navItems.map(item =>
                            <li
                                className={`nav-list-item ${item.page === activePage && "active"}`}
                                onClick={() => onPageSelect(item.page)}
                                key={item.page}
                            >
                                {item.icon}
                                <div>{item.text}</div>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </div>
    )
}