import {useCallback, useEffect, useState} from "react";
import "./video.css"
import {IconButton} from "../IconButton/IconButton";
import {Icon24Fullscreen, Icon24FullscreenExit, Icon28Pause, Icon28Play} from "@vkontakte/icons";
import {secondsToTimeString} from "../../utils/secondsToTimeString";

export const Video = ({src, name}) => {
    const [error, setError] = useState(false)
    const [showOverlayMode, setShowOverlayMode] = useState("show")
    const [videoPlay, setVideoPlay] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)
    const [duration, setDuration] = useState(0)
    const [time, setTime] = useState(0)
    const [changeStart, setChangeStart] = useState(false)
    const [wasPlay, setWasPlay] = useState(true)

    const onChangeTimeStart = useCallback(() => {
        if (wasPlay) {
            document.getElementById("video-element").pause()
        }
        setChangeStart(true)
    }, [wasPlay])

    const onChangeTimeEnd = useCallback(() => {
        if (wasPlay) {
            document.getElementById("video-element").play()
        }
        setChangeStart(false)
    }, [wasPlay])

    const onTogglePlay = useCallback(() => {
        const video = document.getElementById("video-element")
        if (videoPlay) {
            video.pause()
            setWasPlay(false)
        }
        else {
            video.play()
            setWasPlay(true)
        }
    }, [videoPlay])

    const toggleFullscreen = () => {
        const video = document.getElementById("video-wrapper-element")
        if (document.fullscreenElement)
            document.exitFullscreen().then()
        else
            video.requestFullscreen().then()
    }

    const onFullscreenChange = () => {
        document.fullscreenElement ? setFullscreen(true) : setFullscreen(false)
    }

    const onMouseLeave = useCallback(() => {
        videoPlay && setShowOverlayMode("hide")
    }, [videoPlay])

    const onMouseMove = useCallback(() => {
        clearTimeout(closeOverlay)
        setShowOverlayMode("show")
        videoPlay && setTimeout(closeOverlay, 4000)
    }, [videoPlay])

    const onPlayListener = () => {
        setTimeout(closeOverlay, 4000)
        setVideoPlay(true)
    }

    const onPauseListener = () => {
        setShowOverlayMode("show")
        setVideoPlay(false)
    }

    const onLoadMetadata = e => {
        setDuration(e.target.duration)
    }

    const closeOverlay = () => {
        setShowOverlayMode("hide")
    }

    const onTimeChange = useCallback(e => {
        if (changeStart) {
            setTime(e.target.value)
            document.getElementById("video-element").currentTime = e.target.value
        }
        else
            setTime(document.getElementById("video-element").currentTime)
    }, [changeStart, videoPlay])

    useEffect(() => {
        !videoPlay && setShowOverlayMode("show")
    }, [showOverlayMode])

    useEffect(() => {
        const video = document.getElementById("video-element")
        const wrapper = document.getElementById("video-wrapper-element")

        video.addEventListener("loadeddata", onLoadMetadata)
        video.addEventListener("play", onPlayListener)
        video.addEventListener("pause", onPauseListener)
        video.addEventListener("timeupdate", onTimeChange)
        wrapper.addEventListener("fullscreenchange", onFullscreenChange)

        return () => {
            video.removeEventListener("play", onPlayListener)
            video.removeEventListener("pause", onPauseListener)
        }
    }, [])

    return (
        <div className="video-wrapper" id="video-wrapper-element">
            {!error &&
                <>
                    <video
                        className="video"
                        onError={() => setError(true)}
                        preload="metadata"
                        style={{width: "100%"}}
                        src={src}
                        id="video-element"
                        autoPlay={true}
                        onMouseMove={onMouseMove}
                    ></video>
                    <div
                        className={`video-overlay ${showOverlayMode}`}
                        onMouseLeave={onMouseLeave}
                        onMouseMove={onMouseMove}
                    >
                        <div className="video-overlay-header">
                            {name}
                        </div>
                        <div className="video-overlay-controls">
                            <div className="video-overlay-controls-progress">
                                <input
                                    min={0}
                                    max={duration}
                                    type="range"
                                    value={time}
                                    step={0.1}
                                    onMouseUp={onChangeTimeEnd}
                                    onMouseDown={onChangeTimeStart}
                                    onChange={onTimeChange}
                                    className="video-overlay-controls-progress-input"
                                />
                            </div>
                            <div className="video-overlay-controls-bottom">
                                <div className="video-overlay-controls-group">
                                    <IconButton onClick={onTogglePlay} className="video-overlay-controls-button">
                                        {videoPlay && <Icon28Pause/>}
                                        {!videoPlay && <Icon28Play/>}
                                    </IconButton>
                                    <div className="video-overlay-controls-time">
                                        {secondsToTimeString(time)} / {secondsToTimeString(duration)}
                                    </div>
                                </div>
                                <div>
                                    <IconButton onClick={toggleFullscreen} className="video-overlay-controls-button">
                                        {fullscreen && <Icon24FullscreenExit width={28} height={28}/>}
                                        {!fullscreen && <Icon24Fullscreen width={28} height={28}/>}
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            {error && "Видео недоступно"}
        </div>
    )
}