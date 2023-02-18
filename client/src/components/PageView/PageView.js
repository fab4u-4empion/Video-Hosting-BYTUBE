import React from "react";
import "./pageView.css"

export const PageView = ({children, activePage}) => {
    const pages = React.Children.toArray(children)

    return (
        <div className="page-view">
            <div className="page-view-spacer"></div>
            <div className="page-view-content">
                {pages.filter(page => page['props']['id'] === activePage)}
            </div>
        </div>
    )
}