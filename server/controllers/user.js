import {dbPoolSync} from "../config/config.js";
import fs from "fs";
import path from "path";

const __dirname = path.resolve()

export const getHistory = async (req, res) => {
    if (req['user']) {
        const [result] = await dbPoolSync.query(`SELECT views.view_date, videos.v_id, videos.v_name, videos.v_views, videos.v_duration, videos.v_publish_date, users.u_id, users.u_name FROM views JOIN videos ON views.view_video_id=videos.v_id JOIN users ON videos.v_user_id=users.u_id WHERE views.view_user_id="${req['user']['u_id']}" AND videos.v_access!="close" ORDER BY views.view_date DESC, views.view_time DESC`)
        res.json(result)
    } else {
        res.status(401).json("Unauthorized")
    }
}

export const getAccountInfo = async (req, res) => {
    if (req['user']) {
        const [result] = await dbPoolSync.query(`SELECT u_id, u_name, u_description, u_reg_date FROM users WHERE u_id="${req['user']['u_id']}"`)
        const [sessions] = await dbPoolSync.query(`SELECT COUNT(*) AS count FROM sessions WHERE s_user_id="${req['user']['u_id']}"`)
        res.json({
            ...result[0],
            sessionsCount: sessions[0]['count']
        })
    } else {
        res.status(401).json("Unauthorized")
    }
}

export const updateAccountInfo = async (req, res) => {
    if (req['user']) {
        req.file && fs.writeFileSync(`${__dirname}/static/avatars/${req['user']['u_id']}.png`, req.file.buffer)
        req.body['description'] !== null && await dbPoolSync.query(`UPDATE users SET u_description="${req.body['description']}" WHERE u_id="${req['user']['u_id']}"`)
        res.send()
    } else {
        res.status(401).json("Unauthorized")
    }
}

export const getAvatar = (req, res) => {
    if (fs.existsSync(`${__dirname}/static/avatars/${req.query['id']}.png`))
        res.set('Cache-Control', 'no-store').sendFile(`${__dirname}/static/avatars/${req.query['id']}.png`)
    else
        res.status(404).send()
}

export const getChanel = async (req, res) => {
    const [result] = await dbPoolSync.query(`SELECT u_name, u_id, u_description, u_reg_date FROM users WHERE u_id="${req.query['id']}"`)
    if (result[0]) {
        const [videos] = await dbPoolSync.query(`SELECT v_name, v_duration, v_views, v_id, v_publish_date FROM videos WHERE v_user_id="${req.query['id']}" AND v_access="open" ORDER BY v_publish_date DESC`)
        const [subs] = await dbPoolSync.query(`SELECT COUNT(*) AS result FROM subscriptions WHERE s_user_to="${req.query['id']}"`)
        result[0].subsInfo = {}
        result[0].subsInfo.subsCount = subs[0]['result']
        if (req['user']) {
            const [sub] = await dbPoolSync.query(`SELECT EXISTS(SELECT * FROM subscriptions WHERE s_user_from="${req['user']['u_id']}" AND s_user_to="${req.query['id']}") as result`)
            result[0].subsInfo.sub = sub[0]['result']
        }
        result[0].videos = videos
        res.json(result[0])
    } else {
        res.status(404).send()
    }
}

export const subscribe = async (req, res) => {
    if (req['user']) {
        try {
            await dbPoolSync.query(`INSERT INTO subscriptions (s_user_from, s_user_to) VALUES("${req['user']['u_id']}", "${req.query['id']}")`)
        }
        finally {
            const [subs] = await dbPoolSync.query(`SELECT COUNT(*) AS result FROM subscriptions WHERE s_user_to="${req.query['id']}"`)
            const [sub] = await dbPoolSync.query(`SELECT EXISTS(SELECT * FROM subscriptions WHERE s_user_from="${req['user']['u_id']}" AND s_user_to="${req.query['id']}") as result`)
            res.json({
                subsCount: subs[0]['result'],
                sub: sub[0]['result']
            })
        }
    } else {
        res.status(401).json("Unauthorized")
    }
}

export const unsubscribe = async (req, res) => {
    if (req['user']) {
        try {
            await dbPoolSync.query(`DELETE FROM subscriptions WHERE s_user_from="${req['user']['u_id']}" AND s_user_to="${req.query['id']}"`)
        }
        finally {
            const [subs] = await dbPoolSync.query(`SELECT COUNT(*) AS result FROM subscriptions WHERE s_user_to="${req.query['id']}"`)
            const [sub] = await dbPoolSync.query(`SELECT EXISTS(SELECT * FROM subscriptions WHERE s_user_from="${req['user']['u_id']}" AND s_user_to="${req.query['id']}") as result`)
            res.json({
                subsCount: subs[0]['result'],
                sub: sub[0]['result']
            })
        }
    } else {
        res.status(401).json("Unauthorized")
    }
}