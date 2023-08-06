import {dbPool, dbPoolSync} from "../../config/config.js";
import fs from "fs";
import {v4 as uuidv4} from "uuid"
import path from "path";
import ffmpeg from "fluent-ffmpeg"
import {mysqlEscape} from "../../utils/mysqlEscape.js";

const __dirname = path.resolve()

ffmpeg.setFfmpegPath(`${__dirname}/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe`)
ffmpeg.setFfprobePath(`${__dirname}/node_modules/@ffprobe-installer/win32-x64/ffprobe.exe`)

export const updateVideoInfo = async (req, res) => {
    if (req['user']) {
        const data = req.body
        req.file && fs.writeFileSync(`${__dirname}/static/previews/custom/${data['id']}.png`, req.file.buffer)
        await dbPoolSync.query(`UPDATE videos SET v_description="${mysqlEscape(data['description'])}", v_name="${mysqlEscape(data['name'])}", v_access="${data['access']}", v_category="${data['category'] ?? 0}" WHERE v_id="${data['id']}"`)
        const [result] = await dbPoolSync.query(`SELECT * FROM videos WHERE v_id="${data['id']}"`)
        res.json(result[0])
    } else {
        res.status(401).json("Unauthorized")
    }
}

export const getPreview = (req, res) => {
    if (fs.existsSync(`${__dirname}/static/previews/custom/${req.query['id']}.png`))
        res.set('Cache-Control', 'no-store').sendFile(`${__dirname}/static/previews/custom/${req.query['id']}.png`)
    else if (fs.existsSync(`${__dirname}/static/previews/default/${req.query['id']}.png`))
        res.set('Cache-Control', 'no-store').sendFile(`${__dirname}/static/previews/default/${req.query['id']}.png`)
    else
        res.status(404).send()
}

export const getOwnVideos = async (req, res) => {
    if (req['user']) {
        const [categories] = await dbPoolSync.query(`SELECT * FROM categories`)
        const [result] = await dbPoolSync.query(`SELECT * FROM videos WHERE v_user_id="${req['user']['u_id']}" ORDER BY v_publish_date DESC`)
        res.json({
            videos: result,
            categories: categories
        })
    } else {
        res.status(401).json("Unauthorized")
    }
}

export const getOtherVideos = async (req, res) => {
    const [result] = await dbPoolSync.query(`SELECT v_id, v_name, v_views, v_publish_date, v_duration FROM videos WHERE v_user_id="${req.query['u_id']}" AND v_access="open" AND v_id!="${req.query['v_id']}" ORDER BY v_publish_date DESC`)
    res.json(result)
}

export const getAllVideos = async (req, res) => {
    const [categories] = await dbPoolSync.query(`SELECT * FROM categories`)
    const [result] = await dbPoolSync.query(`SELECT videos.v_id, videos.v_name, videos.v_views, videos.v_publish_date, videos.v_duration, users.u_name, users.u_id FROM videos JOIN users ON users.u_id=videos.v_user_id WHERE videos.v_access="open" ORDER BY videos.v_publish_date DESC`)
    res.json({
        videos: result,
        categories: categories
    })
}

export const getVideosByCategory = async (req, res) => {
    if (req.query['q'] === "0") {
        const [result] = await dbPoolSync.query(`SELECT videos.v_id, videos.v_name, videos.v_views, videos.v_publish_date, videos.v_duration, users.u_name, users.u_id FROM videos JOIN users ON users.u_id=videos.v_user_id WHERE videos.v_access="open" ORDER BY videos.v_publish_date DESC`)
        res.json({
            videos: result
        })
    } else {
        const [result] = await dbPoolSync.query(`SELECT videos.v_id, videos.v_name, videos.v_views, videos.v_publish_date, videos.v_duration, users.u_name, users.u_id FROM videos JOIN users ON users.u_id=videos.v_user_id WHERE videos.v_access="open" AND videos.v_category="${req.query['q']}" ORDER BY videos.v_publish_date DESC`)
        res.json({
            videos: result
        })
    }
}

export const uploadVideo = (req, res) => {
    if (req['user']) {
        const id = uuidv4()

        req.on('aborted', () => {
            fs.existsSync(`${__dirname}/static/videos/uploads/${id}`) && fs.unlinkSync(`${__dirname}/static/videos/uploads/${id}`)
        })

        req.pipe(req.busboy)

        req.busboy.on('file', (fieldname, file, filename) => {
            const fstream = fs.createWriteStream(`${__dirname}/static/videos/uploads/${id}.mp4`);

            file.pipe(fstream);

            fstream.on('close', () => {
                ffmpeg(`${__dirname}/static/videos/uploads/${id}.mp4`)
                    .seekInput("00:00:00")
                    .duration(1)
                    .frames(1)
                    .output(`${__dirname}/static/previews/default/${id}.png`)
                    .on('error', (err) => {
                        console.error(`Ошибка: ${err.message}`);
                    })
                    .on('end', () => {
                        ffmpeg.ffprobe(`${__dirname}/static/videos/uploads/${id}.mp4`, async (err, meta) => {
                            await dbPoolSync.query(`INSERT INTO videos (v_id, v_user_id, v_name, v_access, v_duration) VALUES("${id}", "${req['user']['u_id']}", "${mysqlEscape(filename['filename'])}", "close", "${Math.round(meta.format.duration)}")`)
                            const [result] = await dbPoolSync.query(`SELECT * FROM videos WHERE v_id="${id}"`)
                            res.json(result[0])
                        })
                    })
                    .run();
            })
        })
    } else {
        res.status(401).json("Unauthorized")
    }
}

export const streamVideo = async (req, res) => {
    const [check_access] =
        await dbPoolSync.query(`SELECT check_access("${req.user?.u_id}", "${req.query.id}") as result`)
    if (!check_access[0]['result']) {
        res.status(403).send()
    } else {
        //const range = req.headers.range;
        const videoPath = `${__dirname}/static/videos/uploads/${req.query['id']}.mp4`;
        res.sendFile(videoPath)
        // const videoSize = fs.statSync(videoPath).size;
        //
        // const chunkSize = 10_000_000;
        // const start = Number(range.replace(/\D/g, ''));
        // const end = Math.min(start + chunkSize, videoSize -1);
        //
        // const contentLength = end - start + 1;
        //
        // const headers = {
        //     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        //     "Accept-Ranges": "bytes",
        //     "Content-Length": contentLength,
        //     "Content-Type": "video/mp4"
        // }
        // res.writeHead(206, headers);
        //
        // const stream = fs.createReadStream(videoPath, { start, end })
        // stream.pipe(res);
    }
}

export const getVideoInfo = async (req, res) => {
    const [videoInfo] = await dbPoolSync.query(`SELECT v_access, v_publish_date, v_user_id, v_name, v_description, v_views, v_likes_count FROM videos WHERE v_id="${req.query['id']}"`)
    if (!videoInfo[0] || (videoInfo[0]['v_access'] === "close" && videoInfo[0]['v_user_id'] !== req.user?.['u_id'])) {
        res.status(403).send()
    } else {
        await dbPoolSync.query(`UPDATE videos SET v_views=v_views + 1 WHERE v_id="${req.query['id']}"`)
        if (req['user']) {
            await dbPoolSync.query(`INSERT INTO views (view_user_id, view_video_id, view_date, view_time) VALUES("${req['user']['u_id']}", "${req.query['id']}", CURRENT_DATE, CURRENT_TIME) ON DUPLICATE KEY UPDATE view_time=CURRENT_TIME`)
            const [liked] = await dbPoolSync.query(`SELECT COUNT(*) as count FROM likes WHERE l_video_id="${req.query['id']}" AND l_user_id="${req['user']['u_id']}"`)
            videoInfo[0].liked = liked[0].count > 0
        }
        const [userInfo] = await dbPoolSync.query(`SELECT u_name, u_id FROM users WHERE u_id="${videoInfo[0]['v_user_id']}"`)
        videoInfo[0].user = userInfo[0]
        const [subs] = await dbPoolSync.query(`SELECT COUNT(*) AS result FROM subscriptions WHERE s_user_to="${userInfo[0]['u_id']}"`)
        videoInfo[0].user.subsInfo = {}
        videoInfo[0].user.subsInfo.subsCount = subs[0]['result']
        if (req['user']) {
            const [sub] = await dbPoolSync.query(`SELECT EXISTS(SELECT * FROM subscriptions WHERE s_user_from="${req['user']['u_id']}" AND s_user_to="${userInfo[0]['u_id']}") as result`)
            videoInfo[0].user.subsInfo.sub = sub[0]['result']
        }
        res.json(videoInfo[0])
    }
}

export const toggleLike = async (req, res) => {
    if (req['user']) {
        const [liked] = await dbPoolSync.query(`SELECT COUNT(*) as count FROM likes WHERE l_video_id="${req.query['id']}" AND l_user_id="${req['user']['u_id']}"`)
        if (liked[0].count > 0)
            await dbPoolSync.query(`DELETE FROM likes WHERE l_video_id="${req.query['id']}" AND l_user_id="${req['user']['u_id']}"`)
        else
            await dbPoolSync.query(`INSERT INTO likes (l_video_id, l_user_id) VALUES("${req.query['id']}", "${req['user']['u_id']}")`)
        const [likes] = await dbPoolSync.query(`SELECT v_likes_count FROM videos WHERE v_id="${req.query['id']}"`)
        res.json({likes: likes[0]['v_likes_count'], liked: !(liked[0].count > 0)})
    } else {
        res.status(401).json("Unauthorized")
    }
}

export const getLikedVideos = async (req, res) => {
    if (req['user']) {
        const [result] = await dbPoolSync.query(`SELECT videos.v_name, videos.v_publish_date, videos.v_views, videos.v_id, videos.v_duration, users.u_name, users.u_id FROM likes JOIN videos ON likes.l_video_id=videos.v_id JOIN users ON users.u_id=videos.v_user_id WHERE likes.l_user_id="${req['user']['u_id']}" AND videos.v_access!="close" ORDER BY likes.l_date DESC`)
        res.json(result)
    } else {
        res.status(401).json("Unauthorized")
    }
}