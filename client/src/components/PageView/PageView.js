import React from "react";
import "./pageView.css"

export const PageView = ({children}) => {
    return (
        <div className="page-view">
            <div className="page-view-spacer"></div>
            <div className="page-view-content">
                {children}
            </div>
        </div>
    )
}