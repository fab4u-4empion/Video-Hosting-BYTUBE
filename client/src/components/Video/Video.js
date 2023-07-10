import {useCallback, useEffect, useRef, useState} from "react";
import "./video.css"
import {IconButton} from "../IconButton/IconButton";
import {Icon24Fullscreen, Icon24FullscreenExit, Icon28Pause, Icon28Play} from "@vkontakte/icons";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {CustomProgress} from "./CustomProgress/CustomProgress";

let timer = null

export const Video = ({src, name}) => {
    const [error, setError] = useState(false)
    const [showOverlayMode, setShowOverlayMode] = useState("show")
    const [videoPlay, setVideoPlay] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)
    const [duration, setDuration] = useState(0)
    const [time, setTime] = useState(0)
    const [changeStart, setChangeStart] = useState(false)
    const [wasPlay, setWasPlay] = useState(true)

    const videoRef = useRef(null)
    const videoWrapperRef = useRef(null)

    const closeOverlay = useCallback(() => {
        setShowOverlayMode("hide")
    }, [])

    const onChangeTimeStart = useCallback(() => {
        if (wasPlay) {
            videoRef.current.pause()
        }
        setChangeStart(true)
    }, [wasPlay])

    const onChangeTimeEnd = useCallback(() => {
        if (wasPlay) {
            videoRef.current.play()
        }
        setChangeStart(false)
    }, [wasPlay])

    const onTogglePlay = useCallback(() => {
        const video = videoRef.current
        if (videoPlay) {
            video.pause()
            setWasPlay(false)
        }
        else {
            video.play()
            setWasPlay(true)
        }
    }, [videoPlay])

    const toggleFullscreen = useCallback(() => {
        const video = videoWrapperRef.current
        if (document.fullscreenElement)
            document.exitFullscreen().then()
        else
            video.requestFullscreen().then()
    }, [])

    const onFullscreenChange = useCallback(() => {
        document.fullscreenElement ? setFullscreen(true) : setFullscreen(false)
    }, [])

    const onMouseLeave = useCallback(() => {
        videoPlay && setShowOverlayMode("hide")
        clearTimeout(timer)
    }, [videoPlay])

    const onMouseEnter = useCallback(() => {
        videoPlay && setShowOverlayMode("show")
    }, [videoPlay])

    const onMouseMove = useCallback(() => {
        clearTimeout(timer)
        setShowOverlayMode("show")
        if (videoPlay)
            timer = setTimeout(closeOverlay, 4000)
    }, [videoPlay, closeOverlay])

    const onPlayListener = useCallback(() => {
        timer = setTimeout(closeOverlay, 4000)
        setVideoPlay(true)
    }, [])

    const onPauseListener = useCallback(() => {
        clearTimeout(timer)
        setShowOverlayMode("show")
        setVideoPlay(false)
    }, [])

    const onLoadMetadata = useCallback(e => {
        setDuration(e.target.duration)
    }, [])

    const onTimeChange = useCallback(value => {
        setTime(videoRef.current.currentTime)
    }, [])

    const onProgressChange = useCallback(value => {
        setTime(value)
        videoRef.current.currentTime = value
    }, [])

    useEffect(() => {
        !videoPlay && setShowOverlayMode("show")
    }, [showOverlayMode])

    useEffect(() => {
        const video = videoRef.current
        const wrapper = videoWrapperRef.current

        video.addEventListener("loadeddata", onLoadMetadata)
        video.addEventListener("play", onPlayListener)
        video.addEventListener("pause", onPauseListener)
        video.addEventListener("timeupdate", onTimeChange)
        wrapper.addEventListener("fullscreenchange", onFullscreenChange)

        return () => {
            video.removeEventListener("play", onPlayListener)
            video.removeEventListener("pause", onPauseListener)
            video.removeEventListener("loadeddata", onLoadMetadata)
            video.removeEventListener("timeupdate", onTimeChange)
            wrapper.removeEventListener("fullscreenchange", onFullscreenChange)
        }
    }, [])

    return (
        <div className="video-wrapper" ref={videoWrapperRef}>
            {!error &&
                <>
                    <video
                        className="video"
                        onError={() => setError(true)}
                        preload="metadata"
                        style={{width: "100%"}}
                        src={src}
                        autoPlay={true}
                        ref={videoRef}
                    ></video>
                    <div
                        className={`video-overlay ${showOverlayMode}`}
                        onMouseLeave={onMouseLeave}
                        onMouseEnter={onMouseEnter}
                        onMouseMove={onMouseMove}
                    >
                        <div className="video-overlay-header">
                            {name}
                        </div>
                        <div className="video-overlay-controls">
                            <div className="video-overlay-controls-progress">
                                {/*<input*/}
                                {/*    min={0}*/}
                                {/*    max={duration}*/}
                                {/*    type="range"*/}
                                {/*    value={time}*/}
                                {/*    step={0.1}*/}
                                {/*    onMouseUp={onChangeTimeEnd}*/}
                                {/*    onMouseDown={onChangeTimeStart}*/}
                                {/*    onChange={onTimeChange}*/}
                                {/*    className="video-overlay-controls-progress-input"*/}
                                {/*/>*/}
                                <CustomProgress
                                    max={duration}
                                    value={time}
                                    onMouseDown={onChangeTimeStart}
                                    onMouseUp={onChangeTimeEnd}
                                    onChange={onProgressChange}
                                    pause={!videoPlay}
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