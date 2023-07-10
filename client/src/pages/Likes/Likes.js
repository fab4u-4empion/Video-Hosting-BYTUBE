import {Page} from "../../components/Page/Page";
import "./likes.css"
import {useEffect, useState} from "react";
import {useUserContextProvider} from "../../context/userContext";
import {Spinner} from "../../components/Spinner/Spinner";
import {Button} from "../../components/Button/Button";
import {SignInModal} from "../../components/SignInModal/SignInModal";
import {Icon28LikeOutline} from "@vkontakte/icons";
import {NavLink} from "react-router-dom";
import {CHANEL, VIDEO} from "../../consts/pages";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {Avatar} from "../../components/Avatar/Avatar";
import {API, baseURLs} from "../../api/api";
import {pluralRules} from "../../utils/pluralRules";
import {Snackbar} from "../../components/Snackbar/Snackbar";

export const Likes = () => {
    const [fetching, setFetching] = useState(true)
    const [modal, setModal] = useState(null)
    const [videos, setVideos] = useState([])
    const [snackbar, setSnackbar] = useState(null)
    const {user} = useUserContextProvider()

    useEffect(() => {
        setFetching(true)
        API.videos
            .request({
                method: "get",
                url: "/like",
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
                    setSnackbar(<Snackbar onClose={() => setSnackbar(null)}>Ошибка запроса</Snackbar>)
                }
            })
    }, [user])

    return (
        <Page>
            {fetching && <div className="page-centred-content"><Spinner size={35} color="gray"/></div>}
            {!fetching && !user &&
                <div className="page-placeholder">
                    <Icon28LikeOutline width={130} height={130}/>
                    <div>Войдите, чтобы просмотреть понравившиеся видео.</div>
                    <Button
                        className="page-placeholder-action-button"
                        onClick={() => setModal(<SignInModal onClose={() => setModal(null)}/>)}
                    >
                        Войти
                    </Button>
                </div>
            }
            {!fetching && user && videos.length === 0 &&
                <div className="page-placeholder">
                    <Icon28LikeOutline width={130} height={130}/>
                    <div>Вы еще не оценили ни одного видео.</div>
                </div>
            }
            {!fetching && user && videos.length > 0 &&
                <div>
                    <div className="playlist-info-card">
                        <img className="playlist-back-img" src={`${baseURLs.videos}/preview?id=${videos[0]['v_id']}`} alt=""/>
                        <div className="playlist-preview">
                            <img className="playlist-preview-img" src={`${baseURLs.videos}/preview?id=${videos[0]['v_id']}`} alt=""/>
                        </div>
                        <div className="playlist-title">Понравилось</div>
                        <div className="playlist-info">
                            <div className="playlist-author-name">ИВАН</div>
                            <div className="playlist-other-info">{videos.length} видео</div>
                        </div>
                    </div>
                    <div className="playlist-video-table">
                        {videos.map((video, index) =>
                            <div key={video['v_id']}>
                                <NavLink to={`/${VIDEO}/${video['v_id']}`} className="playlist-video-table-item">
                                    <div className="playlist-video-number">{index + 1}</div>
                                    <div className="playlist-video-preview video-preview">
                                        <img
                                            className="video-preview-img"
                                            src={`${baseURLs.videos}/preview?id=${video['v_id']}`}
                                            alt=""
                                        />
                                        <div className="video-preview-duration">
                                            {secondsToTimeString(video['v_duration'])}
                                        </div>
                                    </div>
                                    <div className="playlist-video-info">
                                        <div className="playlist-video-title">{video['v_name']}</div>
                                        <div style={{marginTop: 5}}>
                                            <div className="playlist-video-user-info">
                                                <Avatar
                                                    size={35}
                                                    src={`${baseURLs.user}/avatar?id=${video['u_id']}`}
                                                />
                                                <NavLink to={`/${CHANEL}/${video['u_id']}`} className="playlist-video-user-name">{video['u_name']}</NavLink>
                                            </div>
                                            <div className="playlist-video-subtext">{pluralRules(video['v_views'])}</div>
                                            <div className="playlist-video-subtext">
                                                {new Date(Date.parse(video['v_publish_date'])).toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            }
            {modal}
            {snackbar}
        </Page>
    )
}