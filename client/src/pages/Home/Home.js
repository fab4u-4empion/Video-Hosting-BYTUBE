import {Page} from "../../components/Page/Page";
import {useEffect, useState} from "react";
import {Spinner} from "../../components/Spinner/Spinner";
import axios from "axios";
import "./home.css"
import {VIDEO} from "../../consts/pages";
import {NavLink} from "react-router-dom";
import {Avatar} from "../../components/Avatar/Avatar";
import {useTimeString} from "../../hooks/useTimeString";

export const Home = () => {
    const [fetching, setFetching] = useState(true)
    const [videos, setVideos] = useState(null)

    useEffect(() => {
        axios
            .get("https://localhost:3000/api/v1/videos/all")
            .then(response => {
                setVideos(response.data)
                setFetching(false)
            })
    }, [])

    return (
        <Page title="Главная">
            {fetching && <div className="page-centred-content"><Spinner size={35} color="gray"/></div>}
            {!fetching &&
                <div className="home-videos-table">
                    {videos.map(video =>
                        <NavLink to={`/${VIDEO}/${video['v_id']}`} key={video['v_id']} className="home-videos-table-item">
                            <div className="home-videos-preview">
                                <img
                                    className="home-videos-preview-img"
                                    src={`https://localhost:3000/api/v1/videos/preview?id=${video['v_id']}`}
                                />
                                <div className="home-videos-preview-duration">
                                    {useTimeString(video['v_duration'])}
                                </div>
                            </div>
                            <div className="home-video-description">
                                <Avatar
                                    size={40}
                                    src={`https://localhost:3000/api/v1/users/preview?id=${video['u_id']}`}
                                />
                                <div className="home-video-info">
                                    <div className="home-video-title">{video['v_name']}</div>
                                    <div style={{marginTop: 5}}>
                                        <div className="home-video-subtext home-video-user-name">{video['u_name']}</div>
                                        <div className="home-video-subtext">
                                            {video['v_views']} просмотров
                                        </div>
                                        <div className="home-video-subtext">
                                            {new Date(Date.parse(video['v_publish_date'])).toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    )}
                </div>
            }
        </Page>
    )
}