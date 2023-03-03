import './actionNotify.css'
import {useEffect} from "react";

export const ActionNotify = ({children, onClose}) => {
    const closeTimeout = () => {
        onClose()
    }

    useEffect(() => {
        setTimeout(closeTimeout, 2000)
        return () => clearTimeout(closeTimeout)
    }, [])

    return (
        <div className='action-notify'>
            {children}
        </div>
    )
}