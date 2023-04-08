import {Page} from "../../components/Page/Page";
import {useParams} from "react-router";
import {useCallback, useEffect, useState} from "react";
import {Video} from "../../components/Video/Video";
import {Spinner} from "../../components/Spinner/Spinner";
import axios from "axios";
import "./videoPage.css"
import {Avatar} from "../../components/Avatar/Avatar";
import {Button} from "../../components/Button/Button";
import {useUserContextProvider} from "../../context/userContext";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {CHANEL, VIDEO} from "../../consts/pages";
import {NavLink} from "react-router-dom";
import {Icon24LinkedOutline, Icon24LockOutline} from "@vkontakte/icons";

export const VideoPage = () => {
    const params = useParams()
    const [fetching, setFetching] = useState(true)
    const [fetchingOtherVideos, setFetchingOtherVideos] = useState(true)
    const [videoInfo, setVideoInfo] = useState({})
    const [error, setError] = useState(false)
    const [descriptionOpen, setDescriptionOpen] = useState(false)
    const [otherVideos, setOtherVideos] = useState([])
    const {user} = useUserContextProvider()

    useEffect(() => {
        setFetching(true)
        setError(false)
        axios
            .get(`https://localhost:3000/api/v1/videos/info?id=${params.id}`, {withCredentials: true})
            .then(response => {
                setVideoInfo(response.data)
                loadOtherVideos(response.data['v_user_id'])
            })
            .catch(() => {
                setError(true)
            })
            .finally(() => {
                setFetching(false)
            })
    }, [params])

    const onToggleDescription = useCallback(() => {
        if (descriptionOpen) {
            setDescriptionOpen(false)
            window.scrollTo(0, 0)
        }
        else {
            setDescriptionOpen(true)
        }
    }, [descriptionOpen])

    const loadOtherVideos = (u_id) => {
        axios
            .get(`https://localhost:3000/api/v1/videos/other?u_id=${u_id}&v_id=${params.id}`)
            .then(response => {
                setOtherVideos(response.data)
                setFetchingOtherVideos(false)
            })
    }

    return (
        <Page>
            {fetching && <div className="page-centred-content"><Spinner size={35} color="gray"/></div>}
            {!fetching &&
                <div className="video-page-layout">
                    <div className="video-page-video-container">
                        <Video
                            src={`https://localhost:3000/api/v1/videos/video?id=${params.id}`}
                            name={videoInfo['v_name']}
                        />
                        {!error &&
                            <>
                                <div className="video-page-video-name">
                                    {videoInfo['v_access'] === "link" && <Icon24LinkedOutline style={{paddingRight: 5}} color="dimgray"/>}
                                    {videoInfo['v_access'] === "close" && <Icon24LockOutline style={{paddingRight: 5}} color="dimgray"/>}
                                    {videoInfo['v_name']}
                                </div>
                                <div className="video-page-chanel">
                                    <div className="video-page-chanel-info">
                                        <Avatar
                                            size={45}
                                            src={`https://localhost:3000/api/v1/user/avatar?id=${videoInfo['user']['u_id']}`}
                                        />
                                        <div className="video-page-chanel-description">
                                            <div className="video-page-chanel-name">{videoInfo['user']['u_name']}</div>
                                            <div className="video-gage-chanel-subs">0 подписчиков</div>
                                        </div>
                                    </div>
                                    {user && user['u_id'] !== videoInfo['v_user_id'] &&
                                        <Button>Подписаться</Button>
                                    }
                                    <NavLink to={`/${CHANEL}/${videoInfo['v_user_id']}`} className="video-page-to-chanel">
                                        <Button mode="secondary">Перейти на канал</Button>
                                    </NavLink>
                                </div>
                                <div className="video-page-video-description">
                                    <div className="video-page-video-description-title">
                                        <div>{videoInfo['v_views']} просмотров</div>
                                        <div>{new Date(Date.parse(videoInfo['v_publish_date'])).toLocaleString("ru-RU", {day: "numeric", month: "short", year: "numeric"})}</div>
                                    </div>
                                    <pre className={`video-page-video-description-text ${descriptionOpen ? "open" : "hide"}`}>
                                        {videoInfo['v_description']}
                                    </pre>
                                    <div className="video-page-video-description-more-btn" onClick={onToggleDescription}>
                                        {descriptionOpen ? "Свернуть" : "Еще"}
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    {!error &&
                        <div className="video-page-other-container">
                            {fetchingOtherVideos && <div className="page-centred-content"><Spinner size={30} color="gray"/></div>}
                            {!fetchingOtherVideos && otherVideos.length > 0 &&
                                <>
                                    <div className="video-page-other-title">Другие видео на этом канале</div>
                                    {otherVideos.map(video =>
                                        <NavLink to={`/${VIDEO}/${video['v_id']}`} className="video-page-other-video-item" key={video['v_id']}>
                                            <div className="video-page-other-video-preview">
                                                <img
                                                    className="video-page-other-video-preview-img"
                                                    src={`https://localhost:3000/api/v1/videos/preview?id=${video['v_id']}`}
                                                />
                                                <div className="video-page-other-video-preview-duration">
                                                    {secondsToTimeString(video['v_duration'])}
                                                </div>
                                            </div>
                                            <div className="video-page-other-video-info">
                                                <div className="video-page-other-video-title">{video['v_name']}</div>
                                                <div className="video-page-other-video-description">{video['v_views']} просмотров</div>
                                                <div className="video-page-other-video-description">{new Date(Date.parse(video['v_publish_date'])).toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}</div>
                                            </div>
                                        </NavLink>
                                    )}
                                </>
                            }
                            {!fetchingOtherVideos && otherVideos.length === 0 &&
                                <div className="page-centred-content video-page-other-placeholder">На этом канале больше нет видео</div>
                            }
                        </div>
                    }
                </div>
            }
        </Page>
    )
}