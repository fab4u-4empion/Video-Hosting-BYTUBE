import {Router} from "express";
import {
    getAllVideos,
    getOtherVideos,
    getOwnVideos,
    getPreview,
    getVideoInfo,
    streamVideo,
    updateVideoInfo,
    uploadVideo
} from "../controllers/videos.js";
import multer from "multer";
import busboy from "connect-busboy"

export const videosRouter = new Router()

videosRouter.get("/", multer().any(), getOwnVideos)
videosRouter.get("/all", getAllVideos)
videosRouter.get("/other", getOtherVideos)
videosRouter.get("/video", streamVideo)
videosRouter.get("/preview", getPreview)
videosRouter.get("/info", getVideoInfo)
videosRouter.post("/upload", busboy({highWaterMark: 2 * 1024 * 1024}), uploadVideo)
videosRouter.put("/update", multer().single('preview'), updateVideoInfo)