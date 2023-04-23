import {Router} from "express"
import {
    getAccountInfo,
    getAvatar,
    getChanel,
    getHistory,
    subscribe,
    unsubscribe,
    updateAccountInfo
} from "../controllers/user.js";
import multer from "multer";

export const userRouter = new Router()

userRouter.get("/history", getHistory)
userRouter.get("/account", getAccountInfo)
userRouter.get("/avatar", getAvatar)
userRouter.get("/chanel", getChanel)
userRouter.post("/subscribe", subscribe)
userRouter.post("/unsubscribe", unsubscribe)
userRouter.post("/account", multer().single("avatar"), updateAccountInfo)