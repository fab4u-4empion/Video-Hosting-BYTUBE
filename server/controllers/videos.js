import {dbPoolSync} from "../config/config.js";
import fs from "fs";
import {v4 as uuidv4} from "uuid"
import path from "path";
import ffmpeg from "fluent-ffmpeg"

const __dirname = path.resolve()

ffmpeg.setFfmpegPath(`${__dirname}/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe`)
ffmpeg.setFfprobePath(`${__dirname}/node_modules/@ffprobe-installer/win32-x64/ffprobe.exe`)

export const getPreview = (req, res) => {
    console.log(`${__dirname}/static/previews/default/${req.query['id']}.png`)
    if (fs.existsSync(`${__dirname}/static/previews/custom/${req.query['id']}.png`))
        res.sendFile(`${__dirname}/static/previews/custom/${req.query['id']}.png`)
    else if (fs.existsSync(`${__dirname}/static/previews/default/${req.query['id']}.png`))
        res.sendFile(`${__dirname}/static/previews/default/${req.query['id']}.png`)
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
                        console.error(`Ошибка: ${err.message}`);
                    })
                    .on('end', () => {
                        ffmpeg.ffprobe(`${__dirname}/static/videos/uploads/${id}.mp4`, async (err, meta) => {
                            await dbPoolSync.query(`INSERT INTO videos (v_id, v_user_id, v_name, v_access, v_duration) VALUES("${id}", "${req['user']['u_id']}", "${filename['filename']}", "close", "${Math.round(meta.format.duration)}")`)
                        })
                        res.json({v_id: id})
                    })
                    .run();
            })
        })
    } else {
        res.status(401).json("Unauthorized")
    }
}