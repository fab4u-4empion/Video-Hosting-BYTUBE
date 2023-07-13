import "./videoPopout.css"

export const VideoPopout = ({children, show, width}) => {
    return (
        <div
            className={`video-popout ${show ? "show" : "hide"}`}
            style={{
                width: width + "px"
            }}
        >
            {children}
        </div>
    )
}