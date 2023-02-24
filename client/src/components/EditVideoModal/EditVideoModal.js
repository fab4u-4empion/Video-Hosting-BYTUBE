import "../AddVideoModal/addVideoModal.css"
import {Modal} from "../Modal/Modal";
import {Group} from "../Group/Group";
import {Button} from "../Button/Button";
import {Input} from "../InputControls/Input";
import {Textarea} from "../InputControls/Textarea";
import {Icon20RadioOff, Icon20RadioOn, Icon28PicturePlusOutline} from "@vkontakte/icons";
import axios from "axios";
import {useState} from "react";

export const EditVideoModal = ({onClose, video}) => {
    const [previewUrl, setPreviewUrl] = useState(`https://localhost:3000/api/v1/videos/preview?id=${video['v_id']}`)
    const [videoName, setVideoName] = useState(video['v_name'])
    const [access, setAccess] = useState(video['v_access'])
    const [videoID] = useState(video['v_id'])
    const [description, setDescription] = useState(video['v_description'])

    const onOpenFileDialog = id=> {
        document.getElementById(id).click()
    }

    const onSelectPreview = (e) => {
        const previewFile = e.target.files[0]
        const fr = new FileReader()
        fr.readAsDataURL(previewFile)
        fr.onload = () => {
            setPreviewUrl(fr.result)
        }
    }

    const onUpdateVideoInfo = () => {
        const data = new FormData()
        data.append('preview', document.getElementById("add-video-preview-input").files[0])
        data.append('access', access)
        data.append('name', videoName)
        data.append('description', document.getElementById("add-video-description-input").value)
        data.append('id', videoID)
        axios
            .put('https://localhost:3000/api/v1/videos/update', data, {
                withCredentials: true
            })
            .then(response => {
                onClose()
            })
    }

    const onVideoNameChange = e => {
        setVideoName(e.target.value)
    }

    const onDescriptionChange = e => {
        setDescription(e.target.value)
    }

    const onVideoNameBlur = e => {
        if (e.target.value === "")
            setVideoName(video['v_name'])
    }

    const onAccessChange = e => {
        setAccess(e.target.value)
    }

    return (
        <Modal
            onClose={onClose}
            width={500}
            footer={
                <div className="add-video-modal-footer">
                    <Button onClick={onUpdateVideoInfo} className="add-video-modal-save-button">Сохранить</Button>
                </div>
            }
            title="Редактирование видео"
        >
            <div className="add-video-modal-content">
                <div className="add-video-modal-group">
                    <div className="add-video-modal-groups">
                        <Group
                            title="Информация о видео"
                        >
                            <div className="add-video-modal-group-content">
                                <label className="add-video-modal-label">
                                    Название (обязательное поле)
                                    <Input
                                        type="text"
                                        placeholder="Название"
                                        value={videoName}
                                        onChange={onVideoNameChange}
                                        onBlur={onVideoNameBlur}
                                    />
                                </label>
                                <label className="add-video-modal-label">
                                    Описание
                                    <Textarea onChange={onDescriptionChange} value={description} id="add-video-description-input" placeholder="Расскажите, о чем ваше видео"/>
                                </label>
                            </div>
                        </Group>
                        <Group
                            title="Обложка"
                            subtitle="Выберите обложку для видео. Она должена привлекать внимание зрителей и отражать содержание видео. (По умолчанию - первый кадр из видео)."
                        >
                            <div className="add-video-modal-group-content add-video-modal-preview-group">
                                <div className="add-video-modal-preview-input" onClick={() => onOpenFileDialog("add-video-preview-input")}>
                                    <Icon28PicturePlusOutline/>
                                    Загрузить обложку
                                </div>
                                {previewUrl && <img src={previewUrl} className="add-video-modal-preview-img" alt=""/>}
                                <input
                                    id="add-video-preview-input"
                                    accept=".png,.jpg"
                                    type="file"
                                    className="add-video-modal-file-input"
                                    onChange={onSelectPreview}
                                />
                            </div>
                        </Group>
                        <Group
                            title="Доступ"
                            subtitle="Настройте параметры доступа к видео."
                        >
                            <form name="video-access-form" className="add-video-modal-access-form">
                                <label className="add-video-modal-access-label">
                                    {access === "open" ? <Icon20RadioOn color="darkblue"/> : <Icon20RadioOff/>}
                                    <div>Общий доступ</div>
                                    <input onChange={onAccessChange} className="add-video-modal-access-radio" name="access" type="radio" value="open"/>
                                    <div className="add-video-modal-access-label-description">Видео будет доступно всем.</div>
                                </label>
                                <label className="add-video-modal-access-label">
                                    {access === "link" ? <Icon20RadioOn color="darkblue"/> : <Icon20RadioOff/>}
                                    <div>Доступ по ссылке</div>
                                    <input onChange={onAccessChange} className="add-video-modal-access-radio" name="access" type="radio" value="link"/>
                                    <div className="add-video-modal-access-label-description">Видео будет доступно тем, у кого есть ссылка.</div>
                                </label>
                                <label className="add-video-modal-access-label">
                                    {access === "close" ? <Icon20RadioOn color="darkblue"/> : <Icon20RadioOff/>}
                                    <div>Закрытый доступ</div>
                                    <input onChange={onAccessChange} className="add-video-modal-access-radio" name="access" type="radio" value="close"/>
                                    <div className="add-video-modal-access-label-description">Видео будет доступно только вам.</div>
                                </label>
                            </form>
                        </Group>
                    </div>
                </div>
            </div>
        </Modal>
    )
}