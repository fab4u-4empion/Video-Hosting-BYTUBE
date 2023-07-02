import './snackbar.css'
import {useEffect, useState} from "react";

export const Snackbar = ({children, onClose}) => {
    const [open, setOpen] = useState(false)
    const close = () => {
        setOpen(false)
        setTimeout(onClose, 200)
    }

    useEffect(() => {
        setTimeout(close, 2500)
        setTimeout(() => setOpen(true), 100)
        //return () => clearTimeout(closeTimeout)
    }, [])

    return (
        <div className={`snackbar ${open ? "open" : "close"}`}>
            {children}
        </div>
    )
}