import {Router} from "express";
import {getOwnVideos, uploadVideo} from "../controllers/videos.js";
import multer from "multer";
import busboy from "connect-busboy"

export const videosRouter = new Router()

videosRouter.get("/", multer().any(), getOwnVideos)
videosRouter.post("/upload", busboy({highWaterMark: 2 * 1024 * 1024}), uploadVideo)