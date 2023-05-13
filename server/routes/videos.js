import express, {Router} from "express";
import {
    getAllVideos,
    getComments, getLikedVideos,
    getOtherVideos,
    getOwnVideos,
    getPreview,
    getVideoInfo, saveComment,
    streamVideo, toggleLike,
    updateVideoInfo,
    uploadVideo
} from "../controllers/videos.js";
import multer from "multer";
import busboy from "connect-busboy"

export const videosRouter = new Router()

videosRouter.get("/", getOwnVideos)
videosRouter.get("/all", getAllVideos)
videosRouter.get("/other", getOtherVideos)
videosRouter.get("/video", streamVideo)
videosRouter.get("/preview", getPreview)
videosRouter.get("/info", getVideoInfo)
videosRouter.get("/comments", getComments)
videosRouter.post("/comments", express.json(), saveComment)
videosRouter.post("/like", express.json(), toggleLike)
videosRouter.get("/like", getLikedVideos)
videosRouter.post("/upload", busboy({highWaterMark: 2 * 1024 * 1024}), uploadVideo)
videosRouter.put("/update", multer().single('preview'), updateVideoInfo)