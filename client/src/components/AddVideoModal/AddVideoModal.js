import "./addVideoModal.css"
import {Modal} from "../Modal/Modal";
import {Group} from "../Group/Group";
import {Button} from "../Button/Button";
import {useEffect, useRef, useState} from "react";
import {Input} from "../InputControls/Input";
import {Textarea} from "../InputControls/Textarea";
import {Icon20RadioOff, Icon20RadioOn, Icon28PicturePlusOutline, Icon28UploadOutline} from "@vkontakte/icons";
import axios from "axios";

export const AddVideoModal = ({onClose}) => {
    const [file, setFile] = useState(null)
    const [previewDataUrl, setPreviewDataUrl] = useState("")
    const [videoName, setVideoName] = useState("")
    const [access, setAccess] = useState("close")
    const [abortController] = useState(new AbortController())
    const [uploadReady, setUploadReady] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [videoID, setVideoID] = useState("")

    const onOpenFileDialog = id=> {
        document.getElementById(id).click()
    }

    const onSelectFile = (e) => {
        setFile(e.target.files[0])
        setVideoName(e.target.files[0].name)
        const data = new FormData()
        data.append('file', e.target.files[0])
        axios
            .post('https://localhost:3000/api/v1/videos/upload', data, {
                signal: abortController.signal,
                onUploadProgress: p => setUploadProgress(Math.round(p.loaded / p.total * 100)),
                withCredentials: true
            })
            .then(response => {
                setUploadReady(true)
                setVideoID(response.data['v_id'])
            })
    }

    const onSelectPreview = (e) => {
        const previewFile = e.target.files[0]
        const fr = new FileReader()
        fr.readAsDataURL(previewFile)
        fr.onload = () => {
            setPreviewDataUrl(fr.result)
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
                onClose(true)
            })
    }

    const onVideoNameChange = e => {
        setVideoName(e.target.value)
    }

    const onVideoNameBlur = e => {
        if (e.target.value === "")
            setVideoName(file.name)
    }

    const onAccessChange = e => {
        setAccess(e.target.value)
    }

    useEffect(() => {
        return () => {
            abortController.abort()
        }
    }, [])

    return (
        <Modal
            onClose={() => onClose(uploadReady)}
            width={500}
            footer={file &&
                <div className="add-video-modal-footer">
                    {!uploadReady &&
                        <div className="add-video-modal-footer-progress">
                            <Icon28UploadOutline className="add-video-modal-footer-upload-icon animated"/>
                            <div>
                                <div className="add-video-modal-footer-progress-text">??????????????????: {uploadProgress}%</div>
                                <div className="add-video-modal-footer-progress-description">???? ???????????????????? ?????? ???????? ???? ?????????? ????????????????.</div>
                            </div>
                        </div>
                    }
                    {uploadReady &&
                        <div className="add-video-modal-footer-progress">
                            <Icon28UploadOutline className="add-video-modal-footer-upload-icon"/>
                            <div>
                                <div className="add-video-modal-footer-progress-text">???????? ????????????????</div>
                                <div className="add-video-modal-footer-progress-description">???? ???????????????? ?????????????????? ??????????????????.</div>
                            </div>
                        </div>
                    }
                    <Button onClick={onUpdateVideoInfo} disabled={!uploadReady} className="add-video-modal-save-button">??????????????????</Button>
                </div>
            }
            title="???????????????????? ??????????"
        >
            <div className="add-video-modal-content">
                <div className="add-video-modal-group">
                    {!file &&
                        <Group
                            title="????????"
                            subtitle="???????????????? ??????????, ?????????????? ???????????? ??????????????????."
                            className="add-video-modal-select-file-group"
                        >
                            <div className="add-video-modal-select-file-group-content">
                                <Button onClick={() => onOpenFileDialog("add-video-file-input")} className="add-video-modal-file-button">?????????????? ????????</Button>
                                <input
                                    id="add-video-file-input"
                                    accept=".mp4"
                                    type="file"
                                    className="add-video-modal-file-input"
                                    onChange={onSelectFile}
                                />
                            </div>
                        </Group>
                    }
                    {file &&
                        <div className="add-video-modal-groups">
                            <Group
                                title="???????????????????? ?? ??????????"
                            >
                                <div className="add-video-modal-group-content">
                                    <label className="add-video-modal-label">
                                        ???????????????? (???????????????????????? ????????)
                                        <Input
                                            type="text"
                                            placeholder="????????????????"
                                            value={videoName}
                                            onChange={onVideoNameChange}
                                            onBlur={onVideoNameBlur}
                                        />
                                    </label>
                                    <label className="add-video-modal-label">
                                        ????????????????
                                        <Textarea id="add-video-description-input" placeholder="????????????????????, ?? ?????? ???????? ??????????"/>
                                    </label>
                                </div>
                            </Group>
                            <Group
                                title="??????????????"
                                subtitle="???????????????? ?????????????? ?????? ??????????. ?????? ?????????????? ???????????????????? ???????????????? ???????????????? ?? ???????????????? ???????????????????? ??????????. (???? ?????????????????? - ???????????? ???????? ???? ??????????)."
                            >
                                <div className="add-video-modal-group-content add-video-modal-preview-group">
                                    <div className="add-video-modal-preview-input" onClick={() => onOpenFileDialog("add-video-preview-input")}>
                                        <Icon28PicturePlusOutline/>
                                        ?????????????????? ??????????????
                                    </div>
                                    {previewDataUrl && <img src={previewDataUrl} className="add-video-modal-preview-img" alt=""/>}
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
                                title="????????????"
                                subtitle="?????????????????? ?????????????????? ?????????????? ?? ??????????."
                            >
                                <form name="video-access-form" className="add-video-modal-access-form">
                                    <label className="add-video-modal-access-label">
                                        {access === "open" ? <Icon20RadioOn color="darkblue"/> : <Icon20RadioOff/>}
                                        <div>?????????? ????????????</div>
                                        <input onChange={onAccessChange} className="add-video-modal-access-radio" name="access" type="radio" value="open"/>
                                        <div className="add-video-modal-access-label-description">?????????? ?????????? ???????????????? ????????.</div>
                                    </label>
                                    <label className="add-video-modal-access-label">
                                        {access === "link" ? <Icon20RadioOn color="darkblue"/> : <Icon20RadioOff/>}
                                        <div>???????????? ???? ????????????</div>
                                        <input onChange={onAccessChange} className="add-video-modal-access-radio" name="access" type="radio" value="link"/>
                                        <div className="add-video-modal-access-label-description">?????????? ?????????? ???????????????? ??????, ?? ???????? ???????? ????????????.</div>
                                    </label>
                                    <label className="add-video-modal-access-label">
                                        {access === "close" ? <Icon20RadioOn color="darkblue"/> : <Icon20RadioOff/>}
                                        <div>???????????????? ????????????</div>
                                        <input onChange={onAccessChange} className="add-video-modal-access-radio" name="access" type="radio" value="close"/>
                                        <div className="add-video-modal-access-label-description">?????????? ?????????? ???????????????? ???????????? ??????.</div>
                                    </label>
                                </form>
                            </Group>
                        </div>
                    }
                </div>
            </div>
        </Modal>
    )
}