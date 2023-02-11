import {Router} from "express";
import {login, registration} from "../controllers/auth.js";

export const authRouter = new Router()

authRouter.post("/registration", registration)
authRouter.post("/login", login)