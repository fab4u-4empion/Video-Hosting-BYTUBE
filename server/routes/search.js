import {Router} from "express";
import {getResult} from "../controllers/search.js";

export const searchRouter = new Router()

searchRouter.get("/", getResult)