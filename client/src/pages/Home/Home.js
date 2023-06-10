import {Page} from "../../components/Page/Page";
import {useEffect, useState} from "react";
import {Spinner} from "../../components/Spinner/Spinner";
import axios from "axios";
import "./home.css"
import {CHANEL, VIDEO} from "../../consts/pages";
import {NavLink} from "react-router-dom";
import {Avatar} from "../../components/Avatar/Avatar";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {Tabs} from "../../components/Tabs/Tabs";
import {TabItem} from "../../components/Tabs/TabItem/TabItem";
import {HorizontalScroll} from "../../components/HorizontalScroll/HorizontalScroll";

export const Home = () => {
    const [fetching, setFetching] = useState(true)
    const [videos, setVideos] = useState(null)
    const [categories, setCategories] = useState(null)
    const [selected, setSelected] = useState(0)

    useEffect(() => {
        axios
            .get("https://localhost:3000/api/v1/videos/all")
            .then(response => {
                setVideos(response.data.videos)
                setCategories(response.data.categories)
                setFetching(false)
                console.log(response.data)
            })
    }, [])

    return (
        <Page>
            {fetching && <div className="page-centred-content"><Spinner size={35} color="gray"/></div>}
            {!fetching &&
                <>
                    <div className="home-tabs-wrapper">
                        <HorizontalScroll>
                            <Tabs>
                                {categories.map(c =>
                                    <TabItem text={c['cg_name']} mode={"button"} selected={selected === c['cg_id']} key={c['cg_id']} onClick={() => setSelected(c['cg_id'])}/>
                                )}
                            </Tabs>
                        </HorizontalScroll>
                    </div>
                    <div className="home-videos-table">
                        {videos.map(video =>
                            <NavLink to={`/${VIDEO}/${video['v_id']}`} key={video['v_id']} className="home-videos-table-item">
                                <div className="home-video-preview video-preview">
                                    <img
                                        className="video-preview-img"
                                        src={`https://localhost:3000/api/v1/videos/preview?id=${video['v_id']}`}
                                    />
                                    <div className="video-preview-duration">
                                        {secondsToTimeString(video['v_duration'])}
                                    </div>
                                </div>
                                <div className="home-video-description">
                                    <Avatar
                                        size={40}
                                        src={`https://localhost:3000/api/v1/user/avatar?id=${video['u_id']}`}
                                    />
                                    <div className="home-video-info">
                                        <div className="home-video-title">{video['v_name']}</div>
                                        <div style={{marginTop: 5}}>
                                            <NavLink to={`/${CHANEL}/${video['u_id']}`} className="home-video-subtext home-video-user-name">{video['u_name']}</NavLink>
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
                </>
            }
        </Page>
    )
}