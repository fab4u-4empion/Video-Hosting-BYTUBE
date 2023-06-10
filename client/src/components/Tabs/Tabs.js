import "./tabs.css"
import {useCallback, useEffect, useRef, useState} from "react";

export const Tabs = ({children, className}) => {
    return (
        <div className={`tabs-container ${className ?? ""}`}>
            {children}
        </div>
    )
}