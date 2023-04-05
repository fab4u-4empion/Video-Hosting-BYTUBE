import {Router} from "express"
import {getAccountInfo, getAvatar, getHistory, updateAccountInfo} from "../controllers/user.js";
import multer from "multer";

export const userRouter = new Router()

userRouter.get("/history", getHistory)
userRouter.get("/account", getAccountInfo)
userRouter.get("/avatar", getAvatar)
userRouter.post("/account", multer().single("avatar"), updateAccountInfo)