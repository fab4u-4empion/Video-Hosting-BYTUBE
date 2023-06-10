import {dbPoolSync} from "../config/config.js";

export const getResult = async (req, res) => {
    const videos = []
    const [videosResult] = await dbPoolSync.query(`SELECT videos.v_id, videos.v_name, videos.v_views, videos.v_publish_date, videos.v_duration, users.u_name, users.u_id FROM videos JOIN users ON users.u_id=videos.v_user_id WHERE videos.v_access="open" AND MATCH (videos.v_name) AGAINST ("${req.query['q']}") ORDER BY videos.v_views DESC`)
    const [channels] = await dbPoolSync.query(`SELECT users.u_id, users.u_name, users.u_description FROM users WHERE MATCH (users.u_name) AGAINST ("${req.query['q']}") ORDER BY users.u_name`)
    videos.push(...videosResult)
    for (let channel of channels) {
        const [subs] = await dbPoolSync.query(`SELECT COUNT(*) AS result FROM subscriptions WHERE s_user_to="${channel['u_id']}"`)
        const [videosCount] = await dbPoolSync.query(`SELECT COUNT(*) AS result FROM videos WHERE v_user_id="${channel['u_id']}" AND v_access="open"`)
        const [videosByChannel] = await dbPoolSync.query(`SELECT videos.v_id, videos.v_name, videos.v_views, videos.v_publish_date, videos.v_duration, users.u_name, users.u_id FROM videos JOIN users ON users.u_id=videos.v_user_id WHERE videos.v_access="open" AND videos.v_user_id="${channel['u_id']}" ORDER BY videos.v_views DESC`)
        channel.u_subs_count = subs[0]['result']
        channel.u_videos_count = videosCount[0]['result']
        const ids = new Set(videos.map(o => o['v_id']))
        videos.push(...videosByChannel.filter(o => !ids.has(o['v_id'])))
    }
    const [category] = await dbPoolSync.query(`SELECT * FROM categories WHERE cg_name="${req.query['q']}"`)
    if (category[0]) {
        const [videosByCategory] = await dbPoolSync.query(`SELECT videos.v_id, videos.v_name, videos.v_views, videos.v_publish_date, videos.v_duration, users.u_name, users.u_id FROM videos JOIN users ON users.u_id=videos.v_user_id WHERE videos.v_access="open" AND videos.v_category="${category[0]['cg_id']}" ORDER BY videos.v_views DESC`)
        const ids = new Set(videos.map(o => o['v_id']))
        videos.push(...videosByCategory.filter(o => !ids.has(o['v_id'])))
    }
    res.json({videos, channels})
}