import "./actionSheet.css"
import {useEffect, useRef, useState} from "react";

export const ActionSheet = ({onClose, targetRef, children}) => {
    const rects = targetRef.current.getBoundingClientRect()
    const actionSheetRef = useRef(null)

    const [position, setPosition] = useState({x: 0, y: 0})
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        window.addEventListener("scroll", closeActionSheet)
        return () => window.removeEventListener("scroll", closeActionSheet)
    }, [])

    useEffect(() => {
        const sheetRects = actionSheetRef.current.getBoundingClientRect()
        if (window.innerHeight - rects.top - rects.height > sheetRects.height)
            setPosition({
                x: rects.x,
                y: rects.y + rects.height,
            })
        else
            setPosition({
                x: rects.x,
                y: rects.y - sheetRects.height,
            })
        setTimeout(() => setVisible(true), 100)
    }, [actionSheetRef])

    const closeActionSheet = () => {
        setVisible(false)
        setTimeout(onClose, 100)
    }

    return (
        <div
            className={"action-sheet-wrapper"}
            onClick={closeActionSheet}
        >
            <div
                className={`action-sheet ${visible ? "visible" : ""}`}
                style={{
                    top: `${position.y}px`,
                    left: `${position.x}px`
                }}
                ref={actionSheetRef}
            >
                {children}
            </div>
        </div>
    )
}