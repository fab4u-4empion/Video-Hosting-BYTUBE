import {Page} from "../../components/Page/Page";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {Video} from "../../components/Video/Video";
import {Spinner} from "../../components/Spinner/Spinner";
import axios from "axios";

export const VideoPage = () => {
    const params = useParams()
    const [fetching, setFetching] = useState(true)
    const [videoInfo, setVideoInfo] = useState(null)

    useEffect(() => {
        axios
            .get(`https://localhost:3000/api/v1/videos/info?id=${params.id}`, {withCredentials: true})
            .then(response => {
                setVideoInfo(response.data)
            })
            .finally(() => {
                setFetching(false)
            })
    }, [])

    return (
        <Page title="Видео">
            {fetching && <div className="page-centred-content"><Spinner size={35} color="gray"/></div>}
            {!fetching &&
                <Video
                    src={`https://localhost:3000/api/v1/videos/video?id=${params.id}`}
                    name={videoInfo['v_name']}
                />
            }
        </Page>
    )
}