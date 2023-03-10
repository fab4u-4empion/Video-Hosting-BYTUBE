import express from "express"
import {authRouter} from "./routes/auth.js";
import multer from "multer"
import cors from "cors"
import {auth} from "./controllers/auth.js";
import https from "https"
import fs from "fs"
import path from "path"
import cookieParser from "cookie-parser"
import {videosRouter} from "./routes/videos.js";

const PORT = process.env.port || 3000
const app = express()
const __dirname = path.resolve()

app.use(cors({
    origin: "https://localhost:10888",
    credentials: true
}))
app.use(cookieParser())
app.use(auth)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/videos", videosRouter)

https
    .createServer(
        {
            key: fs.readFileSync(`${__dirname}/config/key.pem`),
            cert: fs.readFileSync(`${__dirname}/config/cert.pem`),
        },
        app
    )
    .listen(PORT, "localhost", function () {
        console.log(`Сервер запущен на порту ${PORT}`);
    });