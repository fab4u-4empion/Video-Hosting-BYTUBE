import {Router} from "express";
import {getUserInfo, login, registration} from "../controllers/auth.js";
import multer from "multer";

export const authRouter = new Router()

authRouter.use(multer().any())

authRouter.post("/registration", registration)
authRouter.post("/login", login)
authRouter.post("/account", getUserInfo)