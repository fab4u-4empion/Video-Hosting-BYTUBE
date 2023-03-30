import {Router} from "express"
import {getHistory} from "../controllers/user.js";

export const userRouter = new Router()

userRouter.get("/history", getHistory)