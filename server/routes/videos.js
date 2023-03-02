import {Router} from "express";
import {getOwnVideos, getPreview, streamVideo, updateVideoInfo, uploadVideo} from "../controllers/videos.js";
import multer from "multer";
import busboy from "connect-busboy"

export const videosRouter = new Router()

videosRouter.get("/", multer().any(), getOwnVideos)
videosRouter.get("/video", streamVideo)
videosRouter.get("/preview", getPreview)
videosRouter.post("/upload", busboy({highWaterMark: 2 * 1024 * 1024}), uploadVideo)
videosRouter.put("/update", multer().single('preview'), updateVideoInfo)