import express, {Router} from "express";
import {
    getAllVideos,
    getLikedVideos,
    getOtherVideos,
    getOwnVideos,
    getPreview, getVideosByCategory,
    getVideoInfo,
    streamVideo, toggleLike,
    updateVideoInfo,
    uploadVideo
} from "../controllers/videos/videos.js";
import multer from "multer";
import busboy from "connect-busboy"
import {deleteComment, editComment, getAnswers, getComments, saveComment} from "../controllers/videos/comments.js";

export const videosRouter = new Router()

videosRouter.get("/comments", getComments)
videosRouter.post("/comments", express.json(), saveComment)
videosRouter.delete("/comments", deleteComment)
videosRouter.put("/comments", express.json(), editComment)
videosRouter.get("/comments/answers", getAnswers)

videosRouter.get("/", getOwnVideos)
videosRouter.get("/all", getAllVideos)
videosRouter.get("/other", getOtherVideos)
videosRouter.get("/video", streamVideo)
videosRouter.get("/preview", getPreview)
videosRouter.get("/info", getVideoInfo)
videosRouter.get("/category", getVideosByCategory)
videosRouter.post("/like", express.json(), toggleLike)
videosRouter.get("/like", getLikedVideos)
videosRouter.post("/upload", busboy({highWaterMark: 2 * 1024 * 1024}), uploadVideo)
videosRouter.put("/update", multer().single('preview'), updateVideoInfo)