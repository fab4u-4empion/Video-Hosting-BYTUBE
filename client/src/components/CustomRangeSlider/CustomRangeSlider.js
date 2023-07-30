import "./customRangeSlider.css"
import {useCallback, useEffect, useRef, useState} from "react";

export const CustomRangeSlider = ({max, value, onMouseDown, onMouseUp, onChange, showPoint = false, className = ""}) => {
    const [pointMode, setPointMode] = useState('hide')
    const [changeStart, setChangeStart] = useState(false)

    const trackRef = useRef(null)

    const mouseDownHandler = (e) => {
        onMouseDown && onMouseDown()
        setPointMode("show")
        const rect = trackRef.current.getBoundingClientRect()
        let clickPosition = e.clientX - rect.left
        if (clickPosition < 0)
            clickPosition = 0
        if (clickPosition > rect.width)
            clickPosition = rect.width
        change(clickPosition / rect.width * max)
        setChangeStart(true)
    }

    const mouseUpHandler = useCallback(() => {
        onMouseUp && onMouseUp()
        setChangeStart(false)
        !showPoint && setPointMode("hide")
    }, [onMouseUp, showPoint])

    const change = (newValue) => {
        onChange && onChange(newValue)
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
        setPointMode(showPoint ? "show" : "hide")
    }, [showPoint])

    return (
        <div
            className={`slider-track ${className}`}
            onMouseDown={mouseDownHandler}
            onMouseUp={mouseUpHandler}
            ref={trackRef}
        >
            <div
                className={"slider-bar"}
                style={{
                    width: (value / max * 100) + "%"
                }}
            >
                <div className={`slider-point ${pointMode}`}/>
            </div>
        </div>
    )
}