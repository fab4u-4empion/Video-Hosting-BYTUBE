import {useCallback, useEffect, useRef, useState} from "react";
import "./video.css"
import {IconButton} from "../IconButton/IconButton";
import {
    Icon24Fullscreen,
    Icon24FullscreenExit,
    Icon24MuteOutline, Icon24PlaySpeed,
    Icon24VolumeOutline,
    Icon28Pause,
    Icon28Play, Icon28SettingsOutline
} from "@vkontakte/icons";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {CustomRangeSlider} from "../CustomRangeSlider/CustomRangeSlider";
import {VideoPopoutItem} from "./VideoPopout/popoutItem/VideoPopoutItem";
import {VideoPopout} from "./VideoPopout/VideoPopout";
import {playSpeeds} from "../../consts/playSpeeds";
import {SettingsSectionPopout} from "./SettingsSectionPopout/SettingsSectionPopout";
import {SpeedSettingsPopout} from "./popouts/SpeedSettingsPopout";

let timer = null

export const Video = ({src, name}) => {
    const [error, setError] = useState(false)
    const [showOverlayMode, setShowOverlayMode] = useState("show")
    const [videoPlay, setVideoPlay] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)
    const [duration, setDuration] = useState(0)
    const [time, setTime] = useState(0)
    const [wasPlay, setWasPlay] = useState(true)
    const [controlsHovered, setControlsHovered] = useState(false)
    const [muted, setMuted] = useState(false)
    const [volume, setVolume] = useState(1)
    const [prevVolume, setPrevVolume] = useState(1)
    const [settingsOpened, setSettingsOpened] = useState(false)
    const [popoutMode, setPopoutMode] = useState("settings")
    const [selectedSpeed, setSelectedSpeed] = useState(playSpeeds.filter(e => e.key === 3)[0])

    const videoRef = useRef(null)
    const videoWrapperRef = useRef(null)

    const selectSpeedHandler = useCallback((value) => {
        setSelectedSpeed(value)
        setPopoutMode("settings")
        setSettingsOpened(false)
    }, [])

    const overlayContentMouseMove = useCallback(() => {
        setControlsHovered(true)
    }, [])

    const overlayContentMouseLeave = useCallback(() => {
        setControlsHovered(false)
    }, [])

    const closeOverlay = useCallback(() => {
        setShowOverlayMode("hide")
    }, [])

    const changeTimeStart = useCallback(() => {
        videoRef.current.pause()
    }, [])

    const changeTimeEnd = useCallback(() => {
        if (wasPlay)
            videoRef.current.play()
    }, [wasPlay])

    const volumeChangeHandler = useCallback(value => {
        setVolume(value)
        setPrevVolume(value)
        setMuted(value === 0)
    }, [])

    const togglePlay = useCallback(() => {
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
        if (document.fullscreenElement)
            document.exitFullscreen().then()
        else
            videoWrapperRef.current.requestFullscreen().then()
    }, [])

    const toggleSettings = useCallback(() => {
        setSettingsOpened(prev => !prev)
        setPopoutMode("settings")
        clearTimeout(timer)
    }, [])

    const toggleMuted = useCallback(() => {
        if (muted && prevVolume === 0)
            setVolume(0.1)
        else if (muted)
            setVolume(prevVolume)
        else
            setVolume(0)
        setMuted(prev => !prev)
    }, [muted])

    const fullscreenChangeHandler = useCallback(() => {
        document.fullscreenElement ? setFullscreen(true) : setFullscreen(false)
    }, [])

    const overlayMouseLeaveHandler = useCallback(() => {
        videoPlay && !settingsOpened && setShowOverlayMode("hide")
        clearTimeout(timer)
    }, [videoPlay, settingsOpened])

    const overlayClickHandler = useCallback((e) => {
        if (videoPlay && settingsOpened && !controlsHovered)
            timer = setTimeout(closeOverlay, 3000)
        settingsOpened && setSettingsOpened(false)
    }, [settingsOpened, videoPlay, controlsHovered])

    const overlayMouseEnterHandler = useCallback(() => {
        videoPlay && setShowOverlayMode("show")
    }, [videoPlay])

    const overlayMouseMoveHandler = useCallback(() => {
        clearTimeout(timer)
        setShowOverlayMode("show")
        if (videoPlay && !controlsHovered && !settingsOpened)
            timer = setTimeout(closeOverlay, 3000)
    }, [videoPlay, controlsHovered])

    const playHandler = useCallback(() => {
        if (!controlsHovered)
            timer = setTimeout(closeOverlay, 3000)
        setVideoPlay(true)
    }, [controlsHovered])

    const endHandler = useCallback(() => {
        setWasPlay(false)
    }, [])

    const pauseHandler = useCallback(() => {
        clearTimeout(timer)
        setShowOverlayMode("show")
        setVideoPlay(false)
    }, [])

    const loadMetaDataHandler = useCallback(e => {
        setDuration(e.target.duration)
    }, [])

    const timeUpdateHandler = useCallback(() => {
        setTime(videoRef.current.currentTime)
    }, [])

    const timeCodeChangeHandler = useCallback(value => {
        setTime(value)
        videoRef.current.currentTime = value
    }, [])

    useEffect(() => {
        const wrapper = videoWrapperRef.current
        wrapper.addEventListener("fullscreenchange", fullscreenChangeHandler)
        return () => {
            wrapper.removeEventListener("fullscreenchange", fullscreenChangeHandler)
        }
    }, [])

    useEffect(() => {
        videoRef.current.volume = volume
    }, [volume])

    useEffect(() => {
        videoRef.current.playbackRate = selectedSpeed.value
    }, [selectedSpeed])

    return (
        <div className="video-wrapper" ref={videoWrapperRef}>
            {!error &&
                <>
                    <VideoPopout
                        show={settingsOpened && popoutMode === "settings"}
                        width={250}
                    >
                        <VideoPopoutItem
                            title={"Скорость"}
                            icon={<Icon24PlaySpeed/>}
                            value={selectedSpeed.label}
                            onClick={() => setPopoutMode("speed")}
                        />
                    </VideoPopout>
                    <SpeedSettingsPopout
                        options={playSpeeds}
                        show={settingsOpened && popoutMode === "speed"}
                        onBack={() => setPopoutMode("settings")}
                        selectedOption={selectedSpeed}
                        onSelectOption={selectSpeedHandler}
                    />
                    <video
                        className="video"
                        onError={() => setError(true)}
                        preload="metadata"
                        style={{width: "100%"}}
                        src={src}
                        autoPlay={true}
                        ref={videoRef}
                        onLoadedData={loadMetaDataHandler}
                        onPlay={playHandler}
                        onEnded={endHandler}
                        onPause={pauseHandler}
                        onTimeUpdate={timeUpdateHandler}
                    ></video>
                    <div
                        className={`video-overlay ${showOverlayMode}`}
                        onMouseLeave={overlayMouseLeaveHandler}
                        onMouseEnter={overlayMouseEnterHandler}
                        onMouseMove={overlayMouseMoveHandler}
                        onClick={overlayClickHandler}
                    >
                        <div className="video-overlay-header">
                            {name}
                        </div>
                        <div
                            className="video-overlay-controls"
                            onMouseLeave={overlayContentMouseLeave}
                            onMouseMove={overlayContentMouseMove}
                        >
                            <div className="video-overlay-controls-progress">
                                <CustomRangeSlider
                                    max={duration}
                                    value={time}
                                    onMouseDown={changeTimeStart}
                                    onMouseUp={changeTimeEnd}
                                    onChange={timeCodeChangeHandler}
                                    showPoint={!videoPlay}
                                    className={"video-time-progress-slider"}
                                />
                            </div>
                            <div className="video-overlay-controls-bottom">
                                <div className="video-overlay-controls-group">
                                    <IconButton onClick={togglePlay} className="video-overlay-controls-button">
                                        {videoPlay ? <Icon28Pause/> : <Icon28Play/>}
                                    </IconButton>
                                    <div className="video-overlay-controls-time">
                                        {secondsToTimeString(time)} / {secondsToTimeString(duration)}
                                    </div>
                                </div>
                                <div className="video-overlay-controls-group">
                                    <div className="video-overlay-controls-volume">
                                        <IconButton onClick={toggleMuted} className="video-overlay-controls-button">
                                            {muted ? <Icon24MuteOutline width={28} height={28}/> : <Icon24VolumeOutline width={28} height={28}/>}
                                        </IconButton>
                                        <CustomRangeSlider
                                            max={1}
                                            className={"video-volume-slider"}
                                            value={volume}
                                            onChange={volumeChangeHandler}
                                        />
                                    </div>
                                    <IconButton onClick={toggleSettings} className="video-overlay-controls-button">
                                        <Icon28SettingsOutline/>
                                    </IconButton>
                                    <IconButton onClick={toggleFullscreen} className="video-overlay-controls-button">
                                        {fullscreen ? <Icon24FullscreenExit width={28} height={28}/> : <Icon24Fullscreen width={28} height={28}/>}
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