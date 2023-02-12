import express from "express"
import {authRouter} from "./routes/auth.js";
import multer from "multer"
import cors from "cors"
import {auth} from "./controllers/auth.js";

const PORT = process.env.port || 3000
const app = express()

app.use(cors({
    origin: "*"
}))
app.use(multer().any())
app.use(auth)
app.use("/api/v1/auth", authRouter)

app.listen(PORT, () => {
    console.log("Start...")
})