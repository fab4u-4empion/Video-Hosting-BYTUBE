import {Router} from "express";
import {registration} from "../controllers/auth.js";

export const authRouter = new Router()

authRouter.post("/registration", registration)