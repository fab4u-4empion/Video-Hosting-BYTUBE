import express from "express"
import {authRouter} from "./routes/auth.js";
import multer from "multer"
import cors from "cors"

const PORT = process.env.port || 3000
const app = express()

app.use(cors({
    origin: "*"
}))
app.use(multer().any())
app.use("/api/v1/auth", authRouter)

app.listen(PORT, () => {
    console.log("Start...")
})