import "./customProgress.css"
import {useCallback, useEffect, useRef, useState} from "react";

export const CustomProgress = ({max, value, onMouseDown, onMouseUp, onChange, pause}) => {
    const [pointMode, setPointMode] = useState('hide')
    const [changeStart, setChangeStart] = useState(false)

    const trackRef = useRef(null)

    const mouseDownHandler = (e) => {
        onMouseDown()
        const rect = trackRef.current.getBoundingClientRect()
        const clickPosition = e.clientX - rect.left
        change(clickPosition / rect.width * max)
        setChangeStart(true)
    }

    const mouseUpHandler = useCallback(() => {
        onMouseUp()
        setChangeStart(false)
    }, [onMouseUp])

    const change = (newValue) => {
        onChange(newValue)
    }

    const mouseMoveHandler = useCallback((e) => {
        e.preventDefault()
        const rect = trackRef.current.getBoundingClientRect()
        let position = e.clientX - rect.left
        if (position < 0)
            position = 0
        if (position > rect.width)
            position = rect.width
        change(position / rect.width * max)
    }, [max])

    useEffect(() => {
        window.addEventListener('mouseup', mouseUpHandler)
        return () => {
            window.removeEventListener('mouseup', mouseUpHandler)
        }
    }, [mouseUpHandler])

    useEffect(() => {
        if (changeStart)
            window.addEventListener('mousemove', mouseMoveHandler)
        return () => {
            window.removeEventListener('mousemove', mouseMoveHandler)
        }
    }, [changeStart])

    useEffect(() => {
        setPointMode(pause ? "show" : "hide")
    }, [pause])

    return (
        <div
            className={"custom-progress-track"}
            onMouseDown={mouseDownHandler}
            onMouseUp={mouseUpHandler}
            ref={trackRef}
        >
            <div
                className={"custom-progress-bar"}
                style={{
                    width: (value / max * 100) + "%"
                }}
            >
                <div className={`custom-progress-point ${pointMode}`}/>
            </div>
        </div>
    )
}