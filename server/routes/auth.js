import {Router} from "express";
import {closeSessions, getUserInfo, login, logout, registration} from "../controllers/auth.js";
import multer from "multer";

export const authRouter = new Router()

authRouter.use(multer().any())

authRouter.post("/registration", registration)
authRouter.post("/login", login)
authRouter.post("/account", getUserInfo)
authRouter.post("/logout", logout)
authRouter.post("/closeSessions", closeSessions)