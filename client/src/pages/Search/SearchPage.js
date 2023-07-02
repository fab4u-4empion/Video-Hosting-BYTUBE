import {Page} from "../../components/Page/Page";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {Spinner} from "../../components/Spinner/Spinner";
import {NavLink} from "react-router-dom";
import {CHANEL, VIDEO} from "../../consts/pages";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {Avatar} from "../../components/Avatar/Avatar";
import "./searchPage.css"
import {Tabs} from "../../components/Tabs/Tabs";
import {TabItem} from "../../components/Tabs/TabItem/TabItem";
import {API, baseURLs} from "../../api/api";

export const SearchPage = () => {
    const [fetching, setFetching] = useState(true)
    const [videos, setVideos] = useState(null)
    const [channels, setChannels] = useState(null)
    const [selected, setSelected] = useState('videos')
    const {query} = useParams()

    useEffect(() => {
        setFetching(true)
        API.search
            .request({
                method: "get",
                params: {
                    q: query
                }
            })
            .then(response => {
                setVideos(response.data.videos)
                setChannels(response.data.channels)
                console.log(response.data)
                setFetching(false)
            })
    }, [query])

    return (
        <Page title={`Результат поиска: "${query}"`}>
            {fetching && <div className="page-centred-content"><Spinner size={35} color="gray"/></div>}
            {!fetching &&
                <>
                    <div className="search-tabs-wrapper">
                        <div className="search-tabs">
                            <Tabs>
                                <TabItem onClick={() => setSelected("videos")} selected={selected === "videos"} text="Видео"/>
                                <TabItem onClick={() => setSelected("channels")} selected={selected === "channels"} text="Каналы"/>
                            </Tabs>
                        </div>
                    </div>
                    {selected === "videos" &&
                        <>
                            {videos.length === 0 &&
                                <div className="page-placeholder">
                                    <div>Ничего не найдено</div>
                                </div>
                            }
                            {videos.length > 0 &&
                                <div className="search-videos-table">
                                    {videos.map(video =>
                                        <NavLink to={`/${VIDEO}/${video['v_id']}`} key={video['v_id']} className="search-videos-table-item">
                                            <div className="search-video-preview video-preview">
                                                <img
                                                    className="video-preview-img"
                                                    src={`${baseURLs.videos}/preview?id=${video['v_id']}`}
                                                />
                                                <div className="video-preview-duration">
                                                    {secondsToTimeString(video['v_duration'])}
                                                </div>
                                            </div>
                                            <div className="search-video-description">
                                                <Avatar
                                                    size={40}
                                                    src={`${baseURLs.user}/avatar?id=${video['u_id']}`}
                                                />
                                                <div className="search-video-info">
                                                    <div className="search-video-title">{video['v_name']}</div>
                                                    <div style={{marginTop: 5}}>
                                                        <NavLink to={`/${CHANEL}/${video['u_id']}`} className="search-video-subtext search-video-user-name">{video['u_name']}</NavLink>
                                                        <div className="search-video-subtext">
                                                            {video['v_views']} просмотров
                                                        </div>
                                                        <div className="search-video-subtext">
                                                            {new Date(Date.parse(video['v_publish_date'])).toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </NavLink>
                                    )}
                                </div>
                            }
                        </>
                    }
                    {selected === "channels" &&
                        <>
                            {channels.length === 0 &&
                                <div className="page-placeholder">
                                    <div>Ничего не найдено</div>
                                </div>
                            }
                            {channels.length > 0 &&
                                <div className="search-content">
                                    <div className="search-channels-table">
                                        {
                                            channels.map(channel =>
                                                <NavLink to={`/${CHANEL}/${channel['u_id']}`} className="search-channel-item">
                                                    <Avatar
                                                        size={100}
                                                        src={`https://localhost:3000/api/v1/user/avatar?id=${channel['u_id']}`}
                                                    />
                                                    <div className="search-channel-info">
                                                        <div className="search-channel-name">{channel['u_name']}</div>
                                                        <div className="search-channel-about">
                                                            <div className="search-subtext">
                                                                {channel['u_subs_count']} подписчиков
                                                            </div>
                                                            <div className="interpunct"></div>
                                                            <div className="search-subtext">
                                                                {channel['u_videos_count']} видео
                                                            </div>
                                                        </div>
                                                        <div className="search-channel-description">
                                                            {channel['u_description']}
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            )
                                        }
                                    </div>
                                </div>
                            }
                        </>
                    }
                </>
            }
        </Page>
    )
}