import "./history.css"
import {Page} from "../../components/Page/Page";
import {useEffect, useState} from "react";
import {Spinner} from "../../components/Spinner/Spinner";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {NavLink} from "react-router-dom";
import {CHANEL, VIDEO} from "../../consts/pages";
import {Avatar} from "../../components/Avatar/Avatar";
import {DateSeparator} from "../../components/DateSeparator/DateSeparator";
import {
    Icon28HistoryForwardOutline,
} from "@vkontakte/icons";
import {Button} from "../../components/Button/Button";
import {useUserContextProvider} from "../../context/userContext";
import {SignInModal} from "../../components/SignInModal/SignInModal";
import {API} from "../../api/api";
import {pluralRules} from "../../utils/pluralRules";

export const History = () => {
    const [fetching, setFetching] = useState(true)
    const [videos, setVideos] = useState([])
    const [modal, setModal] = useState(null)

    const {user} = useUserContextProvider()

    useEffect(() => {
        setFetching(true)
        API.user
            .request({
                method: "get",
                url: "/history",
                withCredentials: true
            })
            .then(response => {
                setVideos(response.data)
                setFetching(false)
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    setFetching(false)
                } else {
                    alert(`Ошибка при выполнении запроса.`)
                }
            })
    }, [user])

    return (
        <Page title="История">
            {fetching && <div className="page-centred-content"><Spinner size={35} color="gray"/></div>}
            {!fetching && user && videos.length === 0 &&
                <div className="page-placeholder">
                    <Icon28HistoryForwardOutline width={130} height={130}/>
                    <div>Вы еще не посмотрели ни одного видео &#9785;</div>
                </div>
            }
            {!fetching && videos.length > 0 &&
                <div className="history-video-table">
                    {videos.map((video, index, array) =>
                        <div key={video['v_id']}>
                            <DateSeparator className="history-date-separator" date={video['view_date']} index={index} array={array}/>
                            <NavLink to={`/${VIDEO}/${video['v_id']}`} className="history-video-table-item">
                                <div className="history-video-preview video-preview">
                                    <img
                                        className="video-preview-img"
                                        src={`https://localhost:3000/api/v1/videos/preview?id=${video['v_id']}`}
                                    />
                                    <div className="video-preview-duration">
                                        {secondsToTimeString(video['v_duration'])}
                                    </div>
                                </div>
                                <div className="history-video-info">
                                    <div className="history-video-title">{video['v_name']}</div>
                                    <div style={{marginTop: 5}}>
                                        <div className="history-video-user-info">
                                            <Avatar
                                                size={35}
                                                src={`https://localhost:3000/api/v1/user/avatar?id=${video['u_id']}`}
                                            />
                                            <NavLink to={`/${CHANEL}/${video['u_id']}`} className="history-video-user-name">{video['u_name']}</NavLink>
                                        </div>
                                        <div className="history-video-subtext">{pluralRules(video['v_views'])}</div>
                                        <div className="history-video-subtext">
                                            {new Date(Date.parse(video['v_publish_date'])).toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                    )}
                </div>
            }
            {!fetching && !user &&
                <div className="page-placeholder">
                    <Icon28HistoryForwardOutline width={130} height={130}/>
                    <div>Войдите, чтобы получить доступ к истории просмотров.</div>
                    <Button
                        className="page-placeholder-action-button"
                        onClick={() => setModal(<SignInModal onClose={() => setModal(null)}/>)}
                    >
                        Войти
                    </Button>
                </div>
            }
            {modal}
        </Page>
    )
}