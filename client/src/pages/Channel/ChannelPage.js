import {Page} from "../../components/Page/Page";
import {useParams} from "react-router";
import "./channelPage.css"
import {useEffect, useState} from "react";
import {Spinner} from "../../components/Spinner/Spinner";
import {Avatar} from "../../components/Avatar/Avatar";
import {NavLink} from "react-router-dom";
import {VIDEO} from "../../consts/pages";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {Icon28UserOutline, Icon28VideoSquareOutline} from "@vkontakte/icons";
import {Tabs} from "../../components/Tabs/Tabs";
import {TabItem} from "../../components/Tabs/TabItem/TabItem";
import {Group} from "../../components/Group/Group";
import {SubscribeButton} from "../../components/SubscribeButton/SubscribeButton";
import {API} from "../../api/api";

export const ChannelPage = () => {
    const params = useParams()
    const [fetching, setFetching] = useState(true)
    const [channel, setChannel] = useState(null)
    const [subsInfo, setSubsInfo] = useState(null)
    const [selected, setSelected] = useState("videos")

    useEffect(() => {
        API.user
            .request({
                method: "get",
                url: "/channel",
                params: {
                    id: params.id
                },
                withCredentials: true
            })
            .then(response => {
                setChannel(response.data)
                setSubsInfo(response.data.subsInfo)
                setFetching(false)
            })
            .catch(err => {
                if (err.response.status === 404)
                    setFetching(false)
                else
                    alert("Не удалось выполнить запрос")
            })
    }, [])

    return (
        <Page>
            {fetching && <div className="page-centred-content"><Spinner size={35} color="gray"/></div>}
            {!fetching && !channel &&
                <div className="page-placeholder">
                    <Icon28UserOutline width={130} height={130}/>
                    <div>Канал не найден</div>
                </div>
            }
            {!fetching && channel &&
                <div>
                    <div className="channel-header">
                        <div className="channel-header-user">
                            <Avatar
                                src={`https://localhost:3000/api/v1/user/avatar?id=${channel['u_id']}`}
                                size={100}
                            />
                            <div className="channel-user-info">
                                <div className="channel-user-name">{channel['u_name']}</div>
                                <div className="channel-user-description">
                                    <div>{subsInfo['subsCount']} подписчиков</div>
                                    <div>{channel.videos.length} видео</div>
                                </div>
                            </div>
                        </div>
                        <SubscribeButton sub={subsInfo['sub']} channel={channel['u_id']} onAction={setSubsInfo}/>
                    </div>
                    <div className="channel-tabs-wrapper">
                        <div className="channel-tabs">
                            <Tabs>
                                <TabItem onClick={() => setSelected("videos")} selected={selected === "videos"} text="Видео"/>
                                <TabItem onClick={() => setSelected("about")} selected={selected === "about"} text="О канале"/>
                            </Tabs>
                        </div>
                    </div>
                    <div className="channel-videos-table">
                        {selected === "videos" && channel.videos.length > 0 && channel.videos.map(video =>
                            <NavLink to={`/${VIDEO}/${video['v_id']}`} key={video['v_id']} className="channel-videos-table-item">
                                <div className="channel-video-preview video-preview">
                                    <img
                                        className="video-preview-img"
                                        src={`https://localhost:3000/api/v1/videos/preview?id=${video['v_id']}`}
                                    />
                                    <div className="video-preview-duration">
                                        {secondsToTimeString(video['v_duration'])}
                                    </div>
                                </div>
                                <div className="channel-video-description">
                                    <div className="channel-video-info">
                                        <div className="channel-video-title">{video['v_name']}</div>
                                        <div style={{marginTop: 5}}>
                                            <div className="channel-video-subtext">
                                                {video['v_views']} просмотров
                                            </div>
                                            <div className="channel-video-subtext">
                                                {new Date(Date.parse(video['v_publish_date'])).toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                        )}
                    </div>
                    {selected === "videos" && channel.videos.length === 0 &&
                        <div className="page-placeholder">
                            <Icon28VideoSquareOutline width={130} height={130}/>
                            <div>На этом канале еще нет видео</div>
                        </div>
                    }
                    {selected === "about" &&
                        <div className="channel-about">
                            {channel['u_description'] &&
                                <Group
                                    title="Описание"
                                    className="channel-about-group"
                                >
                                    <div className="channel-about-text">
                                        {channel['u_description']}
                                    </div>
                                </Group>
                            }
                            <Group
                                title="Другое"
                            >
                                <div className="channel-about-text">
                                    Канал создан {new Date(Date.parse(channel['u_reg_date'])).toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}
                                </div>
                            </Group>
                        </div>
                    }
                </div>
            }
        </Page>
    )
}