import {Page} from "../../components/Page/Page";
import {useEffect, useState} from "react";
import axios from "axios";
import "../common.css"
import {Spinner} from "../../components/Spinner/Spinner";
import {useUserContextProvider} from "../../context/userContext";
import {Icon28UserIncomingOutline, Icon28VideoAddSquareOutline} from "@vkontakte/icons";
import {Button} from "../../components/Button/Button";
import {SignInModal} from "../../components/SignInModal/SignInModal";
import {AddVideoModal} from "../../components/AddVideoModal/AddVideoModal";

export const Videos = () => {
    const [videos, setVideos] = useState([])
    const [fetching, setFetching] = useState(true)
    const {user} = useUserContextProvider()
    const [modal, setModal] = useState(null)

    useEffect(() => {
        updateVideos()
    }, [user])

    useEffect(() => {
        console.log(videos)
    }, [videos])

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

    return (
        <Page title="Ваши видео">
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