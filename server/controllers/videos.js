import {dbPoolSync} from "../config/config.js";
import fs from "fs";
import {v4 as uuidv4} from "uuid"
import path from "path";
import ffmpeg from "fluent-ffmpeg"

const __dirname = path.resolve()

ffmpeg.setFfmpegPath(`${__dirname}/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe`)
ffmpeg.setFfprobePath(`${__dirname}/node_modules/@ffprobe-installer/win32-x64/ffprobe.exe`)

export const updateVideoInfo = async (req, res) => {
    if (req['user']) {
        const data = req.body
        req.file && fs.writeFileSync(`${__dirname}/static/previews/custom/${data['id']}.png`, req.file.buffer)
        await dbPoolSync.query(`UPDATE videos SET v_description="${data['description']}", v_name="${data['name']}", v_access="${data['access']}" WHERE v_id="${data['id']}"`)
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
        const [result] = await dbPoolSync.query(`SELECT * FROM videos WHERE v_user_id="${req['user']['u_id']}" ORDER BY v_publish_date DESC`)
        res.json(result)
    } else {
        res.status(401).json("Unauthorized")
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
                        console.error(`????????????: ${err.message}`);
                    })
                    .on('end', () => {
                        ffmpeg.ffprobe(`${__dirname}/static/videos/uploads/${id}.mp4`, async (err, meta) => {
                            await dbPoolSync.query(`INSERT INTO videos (v_id, v_user_id, v_name, v_access, v_duration) VALUES("${id}", "${req['user']['u_id']}", "${filename['filename']}", "close", "${Math.round(meta.format.duration)}")`)
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
    const [videoInfo] = await dbPoolSync.query(`SELECT v_access, v_user_id FROM videos WHERE v_id="${req.query['id']}"`)
    if (videoInfo[0]['v_access'] === "close" && videoInfo[0]['v_user_id'] !== req.user?.['u_id']) {
        res.status(403).send()
    } else {
        const range = req.headers.range;
        const videoPath = `${__dirname}/static/videos/uploads/${req.query['id']}.mp4`;
        const videoSize = fs.statSync(videoPath).size;

        const chunkSize = 1_000_000;
        const start = Number(range.replace(/\D/g, ''));
        const end = Math.min(start + chunkSize, videoSize -1);

        const contentLength = end - start + 1;

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4"
        }
        res.writeHead(206, headers);

        const stream = fs.createReadStream(videoPath, { start, end })
        stream.pipe(res);
    }
}

export const getVideoInfo = async (req, res) => {
    const [videoInfo] = await dbPoolSync.query(`SELECT v_access, v_user_id, v_name, v_description FROM videos WHERE v_id="${req.query['id']}"`)
    if (videoInfo[0]['v_access'] === "close" && videoInfo[0]['v_user_id'] !== req.user?.['u_id']) {
        res.status(403).send()
    } else {
        res.json(videoInfo[0])
    }
}