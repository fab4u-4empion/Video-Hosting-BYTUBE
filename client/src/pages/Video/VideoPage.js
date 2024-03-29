import {Page} from "../../components/Page/Page";
import {useParams} from "react-router";
import {useCallback, useEffect, useState} from "react";
import {Video} from "../../components/Video/Video";
import {Spinner} from "../../components/Spinner/Spinner";
import "./videoPage.css"
import {Avatar} from "../../components/Avatar/Avatar";
import {Button} from "../../components/Button/Button";
import {CHANEL, VIDEO} from "../../consts/pages";
import {NavLink} from "react-router-dom";
import {Icon24LinkedOutline, Icon24LockOutline, Icon28LikeFillRed, Icon28LikeOutline} from "@vkontakte/icons";
import {SubscribeButton} from "../../components/SubscribeButton/SubscribeButton";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {API, baseURLs} from "../../api/api";
import {pluralRules, pluralSubs} from "../../utils/pluralRules";
import {Comments} from "./commentsSection/Comments";
import {Snackbar} from "../../components/Snackbar/Snackbar";

export const VideoPage = () => {
    const params = useParams()
    const [fetching, setFetching] = useState(true)
    const [fetchingOtherVideos, setFetchingOtherVideos] = useState(true)
    const [videoInfo, setVideoInfo] = useState({})
    const [error, setError] = useState(false)
    const [descriptionOpen, setDescriptionOpen] = useState(false)
    const [otherVideos, setOtherVideos] = useState([])
    const [subsInfo, setSubsInfo] = useState(null)
    const [likes, setLikes] = useState(0)
    const [liked, setLiked] = useState(false)
    const [fetchingLike, setFetchingLike] = useState(false)
    const [snackbar, setSnackbar] = useState(null)

    useEffect(() => {
        setFetching(true)
        setError(false)
        API.videos
            .request({
                method: "get",
                url: "/info",
                params: {
                    id: params.id
                },
                withCredentials: true
            })
            .then(response => {
                setVideoInfo(response.data)
                setSubsInfo(response.data.user.subsInfo)
                setLikes(response.data['v_likes_count'])
                setLiked(response.data['liked'])
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
        API.videos
            .request({
                method: "get",
                url: "/other",
                params: {
                    u_id: u_id,
                    v_id: params.id
                }
            })
            .then(response => {
                setOtherVideos(response.data)
                setFetchingOtherVideos(false)
            })
    }

    const toggleLike = () => {
        setFetchingLike(true)
        API.videos
            .request({
                method: "post",
                url: "/like",
                params: {
                    id: params.id
                },
                withCredentials: true
            })
            .then(response => {
                setLikes(response.data.likes)
                setLiked(response.data.liked)
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    setSnackbar(<Snackbar onClose={() => setSnackbar(null)}>Необходимо войти</Snackbar>)
                } else {
                    setSnackbar(<Snackbar onClose={() => setSnackbar(null)}>Ошибка запроса</Snackbar>)
                }
            })
            .finally(() => setFetchingLike(false))
    }

    return (
        <Page>
            {fetching && <div className="page-centred-content"><Spinner size={35} color="gray"/></div>}
            {snackbar}
            {!fetching &&
                <div className="video-page-layout">
                    <div className="video-page-video-container">
                        <Video
                            src={`${baseURLs.videos}/video?id=${params.id}`}
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
                                            src={`${baseURLs.user}/avatar?id=${videoInfo['user']['u_id']}`}
                                        />
                                        <div className="video-page-chanel-description">
                                            <div className="video-page-chanel-name">{videoInfo['user']['u_name']}</div>
                                            <div className="video-gage-chanel-subs">{pluralSubs(subsInfo['subsCount'])}</div>
                                        </div>
                                    </div>
                                    <SubscribeButton sub={subsInfo['sub']} channel={videoInfo['user']['u_id']} onAction={setSubsInfo}/>
                                    <NavLink to={`/${CHANEL}/${videoInfo['v_user_id']}`} className="video-page-to-chanel">
                                        <Button mode="secondary">Перейти на канал</Button>
                                    </NavLink>
                                    <Button disabled={fetchingLike} onClick={toggleLike} mode="secondary" icon={liked ? <Icon28LikeFillRed width={24} height={24}/> : <Icon28LikeOutline width={24} height={24}/>}>{likes}</Button>
                                </div>
                                <div className="video-page-video-description">
                                    <div className="video-page-video-description-title">
                                        <div>{pluralRules(videoInfo['v_views'])}</div>
                                        <div>{new Date(Date.parse(videoInfo['v_publish_date'])).toLocaleString("ru-RU", {day: "numeric", month: "short", year: "numeric"})}</div>
                                    </div>
                                    <pre className={`video-page-video-description-text ${descriptionOpen ? "open" : "hide"}`}>
                                        {videoInfo['v_description']}
                                    </pre>
                                    <div className="video-page-video-description-more-btn" onClick={onToggleDescription}>
                                        {descriptionOpen ? "Свернуть" : "Еще"}
                                    </div>
                                </div>
                                <Comments videoId={params.id}/>
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
                                            <div className="video-page-other-video-preview video-preview">
                                                <img
                                                    className="video-preview-img"
                                                    src={`${baseURLs.videos}/preview?id=${video['v_id']}`}
                                                />
                                                <div className="video-preview-duration">
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