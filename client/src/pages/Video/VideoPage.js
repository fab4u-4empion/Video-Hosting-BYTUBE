import {Page} from "../../components/Page/Page";
import {useParams} from "react-router";
import {useCallback, useEffect, useState} from "react";
import {Video} from "../../components/Video/Video";
import {Spinner} from "../../components/Spinner/Spinner";
import "./videoPage.css"
import {Avatar} from "../../components/Avatar/Avatar";
import {Button} from "../../components/Button/Button";
import {useUserContextProvider} from "../../context/userContext";
import {CHANEL, VIDEO} from "../../consts/pages";
import {NavLink} from "react-router-dom";
import {Icon24LinkedOutline, Icon24LockOutline, Icon28LikeFillRed, Icon28LikeOutline} from "@vkontakte/icons";
import {SubscribeButton} from "../../components/SubscribeButton/SubscribeButton";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {API} from "../../api/api";
import {pluralComments, pluralRules, pluralSubs} from "../../utils/pluralRules";
import {CommentForm} from "../../components/Comments/CommentForm/CommentForm";

export const VideoPage = () => {
    const params = useParams()
    const [fetching, setFetching] = useState(true)
    const [fetchingOtherVideos, setFetchingOtherVideos] = useState(true)
    const [videoInfo, setVideoInfo] = useState({})
    const [error, setError] = useState(false)
    const [descriptionOpen, setDescriptionOpen] = useState(false)
    const [otherVideos, setOtherVideos] = useState([])
    const [subsInfo, setSubsInfo] = useState(null)
    const [fetchingComments, setFetchingComments] = useState(true)
    const [comments, setComments] = useState(null)
    const [commentText, setCommentText] = useState("")
    const [likes, setLikes] = useState(0)
    const [liked, setLiked] = useState(false)
    const [fetchingLike, setFetchingLike] = useState(false)
    const [commentSending, setCommentSending] = useState(false)

    const {user} = useUserContextProvider()

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
                setLikes(response.data['likes'])
                setLiked(response.data['liked'])
                loadOtherVideos(response.data['v_user_id'])
                loadComments(response.data['v_id'])
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

    const loadComments = (v_id) => {
        API.videos
            .request({
                method: "get",
                url: "/comments",
                params: {
                    v_id: params.id
                }
            })
            .then(response => {
                setFetchingComments(false)
                setComments(response.data)
            })
    }

    const sendComment = (cancelForm) => {
        setCommentSending(true)
        API.videos
            .request({
                method: "post",
                url: "/comments",
                data: {
                    text: commentText,
                    video: params.id
                },
                withCredentials: true
            })
            .then(response => {
                setComments(prev => [response.data, ...prev])
                setCommentSending(false)
                cancelForm()
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
                setFetchingLike(false)
                setLikes(response.data.likes)
                setLiked(response.data.liked)
            })
    }

    const commentTextChangeHandler = (newText) => {
        setCommentText(newText)
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
                                <div className="video-page-comments">
                                    {fetchingComments && <div className="page-centred-content"><Spinner size={30} color="gray"/></div>}
                                    {!fetchingComments &&
                                        <>
                                            <div className="video-page-comments-header">{pluralComments(comments.length)}</div>
                                            {user &&
                                                <CommentForm
                                                    onChange={commentTextChangeHandler}
                                                    defaultText={commentText}
                                                    action={sendComment}
                                                    actionTitle={"Оставить комментарий"}
                                                    actionDisabled={commentSending}
                                                />
                                            }
                                            <div>
                                                {comments.map(comment =>
                                                    <div key={comment['c_id']} className="video-page-comment">
                                                        <Avatar size={40} src={`https://localhost:3000/api/v1/user/avatar?id=${comment['u_id']}`}/>
                                                        <div>
                                                            <div className="video-page-comment-info">
                                                                <div className="video-page-comment-user-name">{comment['u_name']}</div>
                                                                <div className="video-page-comment-date">{comment['c_date'] ? new Date(Date.parse(comment['c_date'])).toLocaleString("ru-RU", {day: "numeric", month: "short", year: "numeric"}) : "сейчас"}</div>
                                                            </div>
                                                            <div className="video-page-comment-text">{comment['c_text']}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    }
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
                                            <div className="video-page-other-video-preview video-preview">
                                                <img
                                                    className="video-preview-img"
                                                    src={`https://localhost:3000/api/v1/videos/preview?id=${video['v_id']}`}
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