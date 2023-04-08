import {Page} from "../../components/Page/Page";
import {useParams} from "react-router";
import "./chanelPage.css"
import {useEffect, useState} from "react";
import {Spinner} from "../../components/Spinner/Spinner";
import axios from "axios";
import {Avatar} from "../../components/Avatar/Avatar";
import {useUserContextProvider} from "../../context/userContext";
import {Button} from "../../components/Button/Button";
import {NavLink} from "react-router-dom";
import {CHANEL, VIDEO} from "../../consts/pages";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {Icon28HistoryForwardOutline, Icon28VideoSquareOutline} from "@vkontakte/icons";

export const ChanelPage = () => {
    const params = useParams()
    const {user} = useUserContextProvider()
    const [fetching, setFetching] = useState(true)
    const [chanel, setChanel] = useState(null)

    useEffect(() => {
        axios
            .get(`https://localhost:3000/api/v1/user/chanel?id=${params['id']}`)
            .then(response => {
                setChanel(response.data)
                console.log(response.data)
                setFetching(false)
            })
            .catch(() => {
                alert("Не удалось выполнить запрос")
            })
    }, [])

    return (
        <Page>
            {fetching && <div className="page-centred-content"><Spinner size={35} color="gray"/></div>}
            {!fetching && chanel &&
                <div>
                    <div className="chanel-header">
                        <div className="chanel-header-user">
                            <Avatar
                                src={`https://localhost:3000/api/v1/user/avatar?id=${chanel['u_id']}`}
                                size={100}
                            />
                            <div className="chanel-user-info">
                                <div className="chanel-user-name">{chanel['u_name']}</div>
                                <div className="chanel-user-description">
                                    <div>0 подписчиков</div>
                                    <div>{chanel.videos.length} видео</div>
                                </div>
                            </div>
                        </div>
                        {user['u_id'] !== chanel['u_id'] && <Button>Подписаться</Button>}
                    </div>
                    <div className="chanel-videos-table">
                        {chanel.videos.length > 0 && chanel.videos.map(video =>
                            <NavLink to={`/${VIDEO}/${video['v_id']}`} key={video['v_id']} className="chanel-videos-table-item">
                                <div className="chanel-videos-preview">
                                    <img
                                        className="chanel-videos-preview-img"
                                        src={`https://localhost:3000/api/v1/videos/preview?id=${video['v_id']}`}
                                    />
                                    <div className="chanel-videos-preview-duration">
                                        {secondsToTimeString(video['v_duration'])}
                                    </div>
                                </div>
                                <div className="chanel-video-description">
                                    <div className="chanel-video-info">
                                        <div className="chanel-video-title">{video['v_name']}</div>
                                        <div style={{marginTop: 5}}>
                                            <div className="chanel-video-subtext">
                                                {video['v_views']} просмотров
                                            </div>
                                            <div className="chanel-video-subtext">
                                                {new Date(Date.parse(video['v_publish_date'])).toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                        )}
                    </div>
                    {chanel.videos.length === 0 &&
                        <div className="page-placeholder">
                            <Icon28VideoSquareOutline width={130} height={130}/>
                            <div>На этом канале еще нет видео</div>
                        </div>
                    }
                </div>
            }
        </Page>
    )
}