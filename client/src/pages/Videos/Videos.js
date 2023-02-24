import {Page} from "../../components/Page/Page";
import {useEffect, useState} from "react";
import axios from "axios";
import "../common.css"
import "./videos.css"
import {Spinner} from "../../components/Spinner/Spinner";
import {useUserContextProvider} from "../../context/userContext";
import {Icon24VideoAddSquareOutline, Icon28UserIncomingOutline, Icon28VideoAddSquareOutline} from "@vkontakte/icons";
import {Button} from "../../components/Button/Button";
import {SignInModal} from "../../components/SignInModal/SignInModal";
import {AddVideoModal} from "../../components/AddVideoModal/AddVideoModal";
import {ACCESS_STATUSES} from "../../consts/access"

export const Videos = () => {
    const [videos, setVideos] = useState([])
    const [fetching, setFetching] = useState(true)
    const {user} = useUserContextProvider()
    const [modal, setModal] = useState(null)

    useEffect(() => {
        updateVideos()
    }, [user])

    const onCloseModal = () => {
        setModal(null)
        updateVideos()
    }

    const updateVideos = () => {
        setFetching(true)
        axios
            .get("https://localhost:3000/api/v1/videos", {withCredentials: true})
            .then(response => {
                setFetching(false)
                setVideos(response.data)
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    setFetching(false)
                } else {
                    alert(`Ошибка при выполнении запроса.`)
                }
            })
    }

    const durationToString = duration => {
        const hours = Math.floor(duration / 3600)
        const minutes = Math.floor(duration / 60)
        const seconds = Math.floor(duration % 60)
        const components = []
        if (hours) {
            components.push(hours.toString())
            components.push(minutes.toString().padStart(2, '0'))
            components.push(seconds.toString().padStart(2, '0'))
        } else {
            components.push(minutes.toString())
            components.push(seconds.toString().padStart(2, '0'))
        }
        return components.join(":")
    }

    return (
        <Page
            title="Ваши видео"
            actions={
                <Button
                    className="videos-add-video-btn"
                    onClick={() => setModal(<AddVideoModal onClose={onCloseModal}/>)}
                >
                    <Icon24VideoAddSquareOutline/>
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
                        onClick={() => setModal(<AddVideoModal onClose={onCloseModal}/>)}
                    >
                        Добавить видео
                    </Button>
                </div>
            }
            {!fetching && user && videos.length > 0 &&
                <div className="videos-table">
                    <div className="videos-table-header videos-table-grid">
                        <div>Видео</div>
                        <div className="text-center">Параметры доступа</div>
                        <div className="text-center">Дата</div>
                        <div className="text-center">Просмотры</div>
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
                                            {durationToString(video['v_duration'])}
                                        </div>
                                    </div>
                                    <div className="videos-item-column">
                                        {video['v_name']}
                                    </div>
                                </div>
                                <div className="videos-item-column text-center">{ACCESS_STATUSES[video['v_access']]}</div>
                                <div className="videos-item-column text-center">
                                    {new Date(Date.parse(video['v_publish_date'])).toLocaleString("ru-RU", {day: "numeric", month: "2-digit", year: "numeric"})}
                                </div>
                                <div className="videos-item-column text-center">{video['v_views']}</div>
                            </div>
                        )}
                    </div>
                </div>
            }
            {!fetching && !user &&
                <div className="page-placeholder">
                    <Icon28UserIncomingOutline width={130} height={130}/>
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
        </Page>
    )
}