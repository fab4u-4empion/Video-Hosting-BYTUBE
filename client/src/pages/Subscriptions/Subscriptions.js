import {Page} from "../../components/Page/Page";
import {Tabs} from "../../components/Tabs/Tabs";
import {TabItem} from "../../components/Tabs/TabItem/TabItem";
import {useEffect, useState} from "react";
import "./subscriptions.css"
import {Spinner} from "../../components/Spinner/Spinner";
import {
    Icon28UserAddOutline, Icon28VideoSquareOutline,
} from "@vkontakte/icons";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {Avatar} from "../../components/Avatar/Avatar";
import {NavLink} from "react-router-dom";
import {CHANEL, VIDEO} from "../../consts/pages";
import {API} from "../../api/api";

export const Subscriptions = () => {
    const [selected, setSelected] = useState("videos")
    const [fetching, setFetching] = useState(true)
    const [subs, setSubs] = useState(null)

    useEffect(() => {
        API.user
            .request({
                method: "get",
                url: "/subs",
                withCredentials: true
            })
            .then(response => {
                setSubs(response.data)
                setFetching(false)
                console.log(response.data)
            })
            .catch(() => {
                alert("Не удалось выполнить запрос")
            })
    }, [])

    return (
        <Page title="Подписки">
            {!fetching && subs.channels.length > 0 &&
                <div>
                    <div className="subs-tabs-wrapper">
                        <div className="subs-tabs">
                            <Tabs>
                                <TabItem onClick={() => setSelected("videos")} selected={selected === "videos"} text="Видео"/>
                                <TabItem onClick={() => setSelected("channels")} selected={selected === "channels"} text="Каналы"/>
                            </Tabs>
                        </div>
                    </div>
                    {selected === "videos" && subs.videos.length === 0 &&
                        <div className="page-placeholder">
                            <Icon28VideoSquareOutline width={130} height={130}/>
                            <div>Никто из ваших подписок еще не опубликовал видео.</div>
                        </div>
                    }
                    <div className="subs-content">
                        {selected === "videos" && subs.videos.length > 0 &&
                            <div className="subs-videos-table">
                                {subs.videos.map(video =>
                                    <div className="subs-videos-table-item">
                                        <NavLink to={`/${CHANEL}/${video['u_id']}`} className="subs-video-user-info">
                                            <Avatar
                                                size={35}
                                                src={`https://localhost:3000/api/v1/user/avatar?id=${video['u_id']}`}
                                            />
                                            <div className="subs-video-user-name">{video['u_name']}</div>
                                        </NavLink>
                                        <NavLink to={`/${VIDEO}/${video['v_id']}`} className="subs-video-item">
                                            <div className="subs-video-preview video-preview">
                                                <img
                                                    className="video-preview-img"
                                                    src={`https://localhost:3000/api/v1/videos/preview?id=${video['v_id']}`}
                                                />
                                                <div className="video-preview-duration">
                                                    {secondsToTimeString(video['v_duration'])}
                                                </div>
                                            </div>
                                            <div className="subs-video-info">
                                                <div className="subs-video-title">{video['v_name']}</div>
                                                <div className="subs-video-about">
                                                    <div className="subs-subtext">
                                                        {video['v_views']} просмотров
                                                    </div>
                                                    <div className="interpunct"></div>
                                                    <div className="subs-subtext">
                                                        {new Date(Date.parse(video['v_publish_date'])).toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}
                                                    </div>
                                                </div>
                                                <div className="subs-video-description">
                                                    {video['v_description']}
                                                </div>
                                            </div>
                                        </NavLink>
                                    </div>
                                )}
                            </div>
                        }
                        {selected === "channels" &&
                            <div className="subs-channels-table">
                                {
                                    subs.channels.map(channel =>
                                        <NavLink to={`/${CHANEL}/${channel['u_id']}`} className="subs-channel-item">
                                            <Avatar
                                                size={100}
                                                src={`https://localhost:3000/api/v1/user/avatar?id=${channel['u_id']}`}
                                            />
                                            <div className="subs-channel-info">
                                                <div className="subs-channel-name">{channel['u_name']}</div>
                                                <div className="subs-channel-about">
                                                    <div className="subs-subtext">
                                                        {channel['u_subs_count']} подписчиков
                                                    </div>
                                                    <div className="interpunct"></div>
                                                    <div className="subs-subtext">
                                                        {channel['u_videos_count']} видео
                                                    </div>
                                                </div>
                                                <div className="subs-channel-description">
                                                    {channel['u_description']}
                                                </div>
                                            </div>
                                        </NavLink>
                                    )
                                }
                            </div>
                        }
                    </div>
                </div>
            }
            {!fetching && subs.length === 0 &&
                <div className="page-placeholder">
                    <Icon28UserAddOutline width={130} height={130}/>
                    <div>Вы еще ни на кого не подписались.</div>
                </div>
            }
            {fetching && <div className="page-centred-content"><Spinner size={35} color="gray"/></div>}
        </Page>
    )
}