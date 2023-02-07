import "./navigation.css"
import {
    Icon28HistoryForwardOutline,
    Icon28HomeOutline,
    Icon28UserAddOutline,
    Icon28VideoSquareOutline
} from "@vkontakte/icons";

const navItems = [
    {
        text: "Главная",
        icon: <Icon28HomeOutline />,
        page: "home"
    },
    {
        text: "Подписки",
        icon: <Icon28UserAddOutline />,
        page: "subscriptions"
    },
    {
        text: "История",
        icon: <Icon28HistoryForwardOutline />,
        page: "history"
    },
    {
        text: "Ваши видео",
        icon: <Icon28VideoSquareOutline />,
        page: "videos"
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