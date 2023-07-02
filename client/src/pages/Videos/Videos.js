import {Page} from "../../components/Page/Page";
import {useEffect, useState} from "react";
import "./videos.css"
import {Spinner} from "../../components/Spinner/Spinner";
import {useUserContextProvider} from "../../context/userContext";
import {
    Icon24VideoAddSquareOutline, Icon28CopyOutline,
    Icon28EditOutline,
    Icon28VideoAddSquareOutline, Icon28VideoOutline, Icon28VideoSquareOutline
} from "@vkontakte/icons";
import {Button} from "../../components/Button/Button";
import {SignInModal} from "../../components/SignInModal/SignInModal";
import {AddVideoModal} from "../../components/AddVideoModal/AddVideoModal";
import {ACCESS_STATUSES} from "../../consts/access"
import {IconButton} from "../../components/IconButton/IconButton";
import {EditVideoModal} from "../../components/EditVideoModal/EditVideoModal";
import {NavLink} from "react-router-dom";
import {VIDEO} from "../../consts/pages";
import {Snackbar} from "../../components/Snackbar/Snackbar";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {API} from "../../api/api";
import {separateDigits} from "../../utils/separateDigits";

export const Videos = () => {
    const [videos, setVideos] = useState([])
    const [fetching, setFetching] = useState(true)
    const {user} = useUserContextProvider()
    const [modal, setModal] = useState(null)
    const [snackbar, setSnackbar] = useState(null)
    const [categories, setCategories] = useState(null)

    useEffect(() => {
        updateVideos()
    }, [user])

    const onCloseModal = (videoInfo) => {
        setModal(null)
        if (videoInfo)
            updateVideos()
    }

    const updateVideos = () => {
        setFetching(true)
        API.videos
            .request({
                method: "get",
                withCredentials: true
            })
            .then(response => {
                setFetching(false)
                setVideos(response.data.videos)
                setCategories(response.data.categories)
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    setFetching(false)
                } else {
                    alert(`Ошибка при выполнении запроса.`)
                }
            })
    }

    const onCopyLink = id => {
        navigator
            .clipboard
            .writeText(`https://localhost:10888/video/${id}`)
            .then(() => {
                setSnackbar(<Snackbar onClose={() => setSnackbar(null)}>Ссылка скопирована</Snackbar>)
            })
    }

    return (
        <Page
            title="Ваши видео"
            actions={user &&
                <Button
                    className="videos-add-video-btn"
                    icon={<Icon24VideoAddSquareOutline/>}
                    onClick={() => setModal(<AddVideoModal onClose={onCloseModal}/>)}
                >
                    Добавить видео
                </Button>
            }
        >
            {fetching && <div className="page-centred-content"><Spinner size={35} color="gray"/></div>}
            {!fetching && user && videos.length === 0 &&
                <div className="page-placeholder">
                    <Icon28VideoAddSquareOutline width={130} height={130}/>
                    <div>У вас еще нет видео.</div>
                    <Button
                        className="page-placeholder-action-button"
                        icon={<Icon24VideoAddSquareOutline/>}
                        onClick={() => setModal(<AddVideoModal onClose={onCloseModal}/>)}
                    >
                        Добавить видео
                    </Button>
                </div>
            }
            {!fetching && user && videos.length > 0 &&
                <div className="videos-table">
                    <div className="videos-table-header-back">
                        <div className="videos-table-header videos-table-grid">
                            <div>Видео</div>
                            <div className="text-center">Параметры доступа</div>
                            <div className="text-center">Дата</div>
                            <div className="text-center">Просмотры</div>
                        </div>
                    </div>
                    <div className="videos-table-items">
                        {videos.map(video =>
                            <div className="videos-table-grid videos-table-item" key={video['v_id']}>
                                <div className="videos-video-common">
                                    <div className="videos-video-preview">
                                        <img
                                            className="videos-video-preview-img"
                                            src={`https://localhost:3000/api/v1/videos/preview?id=${video['v_id']}`}
                                        />
                                        <div className="videos-video-preview-duration">
                                            {secondsToTimeString(video['v_duration'])}
                                        </div>
                                    </div>
                                    <div className="videos-item-column">
                                        <div className="videos-item-name">{video['v_name']}</div>
                                        <div className="videos-item-column-controls">
                                            <IconButton
                                                onClick={() => {
                                                    setModal(<EditVideoModal video={video} onClose={onCloseModal} categories={categories}/>)
                                                }}>
                                                <Icon28EditOutline/>
                                            </IconButton>
                                            <IconButton onClick={() => onCopyLink(video['v_id'])}>
                                                <Icon28CopyOutline/>
                                            </IconButton>
                                            <IconButton>
                                                <NavLink to={`/${VIDEO}/${video['v_id']}`} style={{color: "black"}}>
                                                    <Icon28VideoOutline/>
                                                </NavLink>
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                                <div className="videos-item-column text-center">{ACCESS_STATUSES[video['v_access']]}</div>
                                <div className="videos-item-column text-center">
                                    {new Date(Date.parse(video['v_publish_date'])).toLocaleString("ru-RU", {day: "2-digit", month: "2-digit", year: "numeric"})}
                                </div>
                                <div className="videos-item-column text-center">{separateDigits(video['v_views'])}</div>
                            </div>
                        )}
                    </div>
                </div>
            }
            {!fetching && !user &&
                <div className="page-placeholder">
                    <Icon28VideoSquareOutline width={130} height={130}/>
                    <div>Войдите, чтобы получить доступ к вашим видео.</div>
                    <Button
                        className="page-placeholder-action-button"
                        onClick={() => setModal(<SignInModal onClose={() => setModal(null)}/>)}
                    >
                        Войти
                    </Button>
                </div>
            }
            {modal}
            {snackbar}
        </Page>
    )
}