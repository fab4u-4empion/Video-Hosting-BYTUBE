import {Page} from "../../components/Page/Page";
import {useParams} from "react-router";
import "./chanelPage.css"
import {useEffect, useState} from "react";
import {Spinner} from "../../components/Spinner/Spinner";
import axios from "axios";
import {Avatar} from "../../components/Avatar/Avatar";
import {NavLink} from "react-router-dom";
import {VIDEO} from "../../consts/pages";
import {secondsToTimeString} from "../../utils/secondsToTimeString";
import {Icon28UserOutline, Icon28VideoSquareOutline} from "@vkontakte/icons";
import {Tabs} from "../../components/Tabs/Tabs";
import {TabItem} from "../../components/Tabs/TabItem/TabItem";
import {Group} from "../../components/Group/Group";
import {SubscribeButton} from "../../components/SubscribeButton/SubscribeButton";

export const ChanelPage = () => {
    const params = useParams()
    const [fetching, setFetching] = useState(true)
    const [chanel, setChanel] = useState(null)
    const [subsInfo, setSubsInfo] = useState(null)
    const [selected, setSelected] = useState("videos")

    useEffect(() => {
        axios
            .get(`https://localhost:3000/api/v1/user/chanel?id=${params['id']}`, {withCredentials: true})
            .then(response => {
                setChanel(response.data)
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
            {!fetching && !chanel &&
                <div className="page-placeholder">
                    <Icon28UserOutline width={130} height={130}/>
                    <div>Канал не найден</div>
                </div>
            }
            {!fetching && chanel &&
                <div>
                    <div className="chanel-header">
                        <div className="chanel-header-user">
                            <Avatar
                                src={`https://localhost:3000/api/v1/user/avatar?id=${chanel['u_id']}`}
                                size={100}
                            />
                            <div className="chanel-user-info">
                                <div className="chanel-user-name">{chanel['u_name']}</div>
                                <div className="chanel-user-description">
                                    <div>{subsInfo['subsCount']} подписчиков</div>
                                    <div>{chanel.videos.length} видео</div>
                                </div>
                            </div>
                        </div>
                        <SubscribeButton sub={subsInfo['sub']} chanel={chanel['u_id']} onAction={setSubsInfo}/>
                    </div>
                    <div className="chanel-tabs-wrapper">
                        <div className="chanel-tabs">
                            <Tabs>
                                <TabItem onClick={() => setSelected("videos")} selected={selected === "videos"} text="Видео"/>
                                <TabItem onClick={() => setSelected("about")} selected={selected === "about"} text="О канале"/>
                            </Tabs>
                        </div>
                    </div>
                    <div className="chanel-videos-table">
                        {selected === "videos" && chanel.videos.length > 0 && chanel.videos.map(video =>
                            <NavLink to={`/${VIDEO}/${video['v_id']}`} key={video['v_id']} className="chanel-videos-table-item">
                                <div className="chanel-videos-preview">
                                    <img
                                        className="chanel-videos-preview-img"
                                        src={`https://localhost:3000/api/v1/videos/preview?id=${video['v_id']}`}
                                    />
                                    <div className="chanel-videos-preview-duration">
                                        {secondsToTimeString(video['v_duration'])}
                                    </div>
                                </div>
                                <div className="chanel-video-description">
                                    <div className="chanel-video-info">
                                        <div className="chanel-video-title">{video['v_name']}</div>
                                        <div style={{marginTop: 5}}>
                                            <div className="chanel-video-subtext">
                                                {video['v_views']} просмотров
                                            </div>
                                            <div className="chanel-video-subtext">
                                                {new Date(Date.parse(video['v_publish_date'])).toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                        )}
                    </div>
                    {selected === "videos" && chanel.videos.length === 0 &&
                        <div className="page-placeholder">
                            <Icon28VideoSquareOutline width={130} height={130}/>
                            <div>На этом канале еще нет видео</div>
                        </div>
                    }
                    {selected === "about" &&
                        <div className="chanel-about">
                            {chanel['u_description'] &&
                                <Group
                                    title="Описание"
                                    className="chanel-about-group"
                                >
                                    <div className="chanel-about-text">
                                        {chanel['u_description']}
                                    </div>
                                </Group>
                            }
                            <Group
                                title="Другое"
                            >
                                <div className="chanel-about-text">
                                    Канал создан {new Date(Date.parse(chanel['u_reg_date'])).toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}
                                </div>
                            </Group>
                        </div>
                    }
                </div>
            }
        </Page>
    )
}