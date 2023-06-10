import "./horizontalScroll.css"
import {useCallback, useEffect, useRef, useState} from "react";
import {IconButton} from "../IconButton/IconButton";
import {
    Icon24ChevronLeft,
    Icon24ChevronRight,
} from "@vkontakte/icons";

export const HorizontalScroll = ({children}) => {
    const scrollRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const scrollHandler = useCallback((e) => {
        const scrollElement = scrollRef.current
        setCanScrollLeft(scrollElement.scrollLeft > 0)
        setCanScrollRight(Math.ceil(scrollElement.scrollLeft) + scrollElement.offsetWidth < scrollElement.scrollWidth)
    }, [scrollRef])

    const scrollToRight = useCallback(() => {
        scrollRef.current.scrollBy({left: +250, behavior: "smooth"})
    }, [scrollRef])

    const scrollToLeft = useCallback(() => {
        scrollRef.current.scrollBy({left: -250, behavior: "smooth"})
    }, [scrollRef])

    useEffect(scrollHandler, [scrollHandler, scrollRef])

    return (
        <div className={"scroll-container"}>
            {canScrollLeft &&
                <div className="scroll-arrow-right-container scroll-arrow-left">
                    <div className="scroll-arrow-right-container">
                        <IconButton onClick={scrollToLeft} className={"scroll-button"}><Icon24ChevronLeft/></IconButton>
                    </div>
                </div>
            }
            {canScrollRight &&
                <div className="scroll-arrow-right-container scroll-arrow-right">
                    <IconButton onClick={scrollToRight} className={"scroll-button"}><Icon24ChevronRight/></IconButton>
                </div>
            }
            <div className={"scroll-in"} ref={scrollRef} onScroll={scrollHandler}>
                {children}
            </div>
        </div>
    )
}