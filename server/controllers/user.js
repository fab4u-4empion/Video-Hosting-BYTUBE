import {dbPoolSync} from "../config/config.js";

export const getHistory = async (req, res) => {
    if (req['user']) {
        const [result] = await dbPoolSync.query(`SELECT views.view_date, videos.v_id, videos.v_name, videos.v_views, videos.v_duration, videos.v_publish_date, users.u_id, users.u_name FROM views JOIN videos ON views.view_video_id=videos.v_id JOIN users ON videos.v_user_id=users.u_id WHERE views.view_user_id="${req['user']['u_id']}" AND videos.v_access!="close" ORDER BY views.view_date DESC, views.view_time DESC`)
        res.json(result)
    } else {
        res.status(401).json("Unauthorized")
    }
}