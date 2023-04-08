import {Page} from "../../components/Page/Page";
import {Spinner} from "../../components/Spinner/Spinner";
import {useEffect, useState} from "react";
import {Avatar} from "../../components/Avatar/Avatar";
import axios from "axios";
import {Icon28EditOutline, Icon28UserIncomingOutline, Icon28UserOutline} from "@vkontakte/icons";
import "./account.css"
import {Textarea} from "../../components/InputControls/Textarea";
import {Group} from "../../components/Group/Group";
import {Button} from "../../components/Button/Button";
import {ActionNotify} from "../../components/ActionNotify/ActionNotify";
import {onOpenFileDialog} from "../../utils/openFileDialog";
import {useUserContextProvider} from "../../context/userContext";
import {SignInModal} from "../../components/SignInModal/SignInModal";
import {ChangePasswordModal} from "../../components/ChangePasswordModal/ChangePasswordModal";

export const Account = () => {
    const [fetching, setFetching] = useState(true)
    const [userInfo, setUserInfo] = useState(null)
    const [description, setDescription] = useState(null)
    const [avatarURL, setAvatarUrl] = useState(null)
    const [notify, setNotify] = useState(null)
    const [modal, setModal] = useState(null)

    const {logOut, user} = useUserContextProvider()

    useEffect(() => {
        setFetching(true)
        axios
            .get("https://localhost:3000/api/v1/user/account", {withCredentials: true})
            .then(response => {
                setFetching(false)
                setUserInfo(response.data)
                setAvatarUrl(`https://localhost:3000/api/v1/user/avatar?id=${response.data['u_id']}`)
                console.log(response.data)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    setFetching(false)
                } else {
                    alert("Не удалось выполнить запрос")
                }
            })
    }, [user])

    useEffect(() => {
        userInfo && setDescription(userInfo['u_description'])
    }, [userInfo])

    const onUpdateAccountInfo = () => {
        const data = new FormData()
        data.append("description", description)
        data.append("avatar", document.getElementById("add-avatar-file-input").files[0])
        axios
            .post("https://localhost:3000/api/v1/user/account", data, {withCredentials: true})
            .then(response => {
                setNotify(<ActionNotify onClose={() => setNotify(null)}>Информация сохранена</ActionNotify>)
            })
            .catch(() => {
                alert("Не удалось выполнить запрос")
            })
    }

    const onSelectAvatar = (e) => {
        const previewFile = e.target.files[0]
        const fr = new FileReader()
        fr.readAsDataURL(previewFile)
        fr.onload = () => {
            setAvatarUrl(fr.result)
        }
    }

    const onLogOut = () => {
        setUserInfo(null)
        setDescription(null)
        setAvatarUrl(null)
        logOut()
    }

    const onCloseSessions = () => {
        axios
            .post("https://localhost:3000/api/v1/auth/closeSessions", {}, {withCredentials: true})
            .then(response => {
                setUserInfo(prev => {
                    prev['sessionsCount'] = response.data.sessionsCount
                    return {...prev}
                })
                setNotify(<ActionNotify onClose={() => setNotify(null)}>Все сеансы завершены</ActionNotify>)
            })
            .catch(() => {
                alert("Не удалось выполнить запрос")
            })
    }

    return (
        <Page
            title="Аккаунт"
        >
            {fetching && <div className="page-centred-content"><Spinner size={35} color="gray"/></div>}
            {!fetching && userInfo &&
                <div className="account-page">
                    <div className="account-page-manage">
                        <Group
                            title="Информация об аккаунте"
                        >
                            <div className="account-page-group-content">
                                <div className="account-page-header">
                                    <Avatar
                                        size={60}
                                        overlay={{
                                            icon: <Icon28EditOutline width={25} height={25}/>,
                                            action: () => onOpenFileDialog("add-avatar-file-input")
                                        }}
                                        src={avatarURL}
                                    />
                                    <input
                                        id="add-avatar-file-input"
                                        accept="image/*"
                                        type="file"
                                        className="add-video-modal-file-input"
                                        onChange={onSelectAvatar}
                                    />
                                    <div className="account-page-user-name">{userInfo['u_name']}</div>
                                </div>
                                <label className="account-page-label">
                                    Описание
                                    <Textarea value={description} onChange={e => setDescription(e.target.value)} id="account-page-description-input" placeholder="Расскажите, о чем вы снимаете видео"/>
                                </label>
                                <div className="account-page-label">
                                    Аккаунт зарегистрирован {new Date(Date.parse(userInfo['u_reg_date'])).toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}
                                </div>
                                <Button fit onClick={onUpdateAccountInfo}>Сохранить</Button>
                            </div>
                        </Group>
                        <Group
                            title="Безопасность"
                        >
                            <div className="account-page-group-content">
                                <div className="account-page-label">Активных сеансов: {userInfo['sessionsCount']}</div>
                                <div className="account-button-group">
                                    <Button
                                        onClick={() => setModal(
                                            <ChangePasswordModal
                                                onClose={() => setModal(null)}
                                                onSuccess={() => setNotify(<ActionNotify onClose={() => setNotify(null)}>Пароль изменен</ActionNotify>)}
                                            />
                                        )}
                                    >
                                        Изменить пароль
                                    </Button>
                                    <Button onClick={onCloseSessions} mode="secondary">Завершить сеансы</Button>
                                    <Button onClick={onLogOut} mode="danger">Выйти</Button>
                                </div>
                            </div>
                        </Group>
                    </div>
                </div>
            }
            {!fetching && !userInfo &&
                <div className="page-placeholder">
                    <Icon28UserOutline width={130} height={130}/>
                    <div>Войдите, чтобы получить доступ к аккаунту.</div>
                    <Button
                        className="page-placeholder-action-button"
                        onClick={() => setModal(<SignInModal onClose={() => setModal(null)}/>)}
                    >
                        Войти
                    </Button>
                </div>
            }
            {notify}
            {modal}
        </Page>
    )
}