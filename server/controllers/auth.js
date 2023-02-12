import {dbPool, dbPoolSync} from "../config/config.js";
import bcrypt from "bcrypt"
import crypto from "crypto";
import {v4 as uuidv4} from "uuid"

const startSession = async (userID, res) => {
    const sessionKey = bcrypt.genSaltSync(10)
    const id = uuidv4()
    const head = Buffer
        .from(JSON.stringify({alg: 'HS256', typ: 'jwt'}))
        .toString("base64")
    const payload = Buffer
        .from(JSON.stringify({id}))
        .toString("base64")
    const signature = crypto
        .createHmac("sha256", sessionKey)
        .update(`${head}.${payload}`)
        .digest("base64")
    await dbPoolSync.query(`INSERT INTO sessions (s_id, u_id, s_key) VALUES ("${id}", "${userID}", "${sessionKey}")`)
    res.json(`${head}.${payload}.${signature}`)
}

export const registration = async (req, res) => {
    const data = req.body
    !data["u_name"] && res.status(400).json("Вы не ввели имя")
    !data["u_password"] && res.status(400).json("Вы не ввели пароль")
    !data["u_confirm_password"] && res.status(400).json("Вы не подтвердили пароль")
    data["u_password"] !== data["u_confirm_password"] && res.status(400).json("Пароли не совпадают")
    const [countQueryResult] = await dbPoolSync.query(`SELECT COUNT(*) as count FROM users WHERE u_name="${data["u_name"]}"`)
    countQueryResult[0].count !== 0 && res.status(400).json("Имя уже занято")
    const hash = bcrypt.hashSync(data["u_password"], bcrypt.genSaltSync(10))
    const id = uuidv4()
    await dbPoolSync.query(`INSERT INTO users (u_id, u_name, u_password) VALUES ("${id}", "${data["u_name"]}", "${hash}")`)
    await startSession(id, res)
}

export const login = async (req, res) => {
    const data = req.body
    !data["u_name"] && res.status(400).json("Вы не ввели имя")
    !data["u_password"] && res.status(400).json("Вы не ввели пароль")
    const [userQueryResult] = await dbPoolSync.query(`SELECT * FROM users WHERE u_name="${data["u_name"]}"`)
    !userQueryResult[0] && res.status(400).json("Пользователя не существует")
    !bcrypt.compareSync(data["u_password"], userQueryResult[0]["u_password"]) && res.status(400).json("Неверный пароль")
    await startSession(userQueryResult[0]["u_id"], res)
}

export const getUserInfo = async (req, res) => {
    req.user && res.json(req.user)
    res.status(401).json("Unauthorized")
}

export const auth = (req, res, next) => {
    if (req.headers.authorization) {
        const tokenParts = req.headers.authorization
            .split('.')
        const session = JSON.parse(
            Buffer
                .from(tokenParts[1], "base64")
                .toString("utf-8")
        )
        dbPool.query(`SELECT s_key, u_id FROM sessions WHERE s_id="${session.id}"`, (err, sessionInfo) => {
            if (sessionInfo[0]) {
                const signature = crypto
                    .createHmac('SHA256', sessionInfo[0]["s_key"])
                    .update(`${tokenParts[0]}.${tokenParts[1]}`)
                    .digest('base64')
                if (signature === tokenParts[2])
                    dbPool.query(`SELECT u_id, u_name FROM users WHERE u_id="${sessionInfo[0]["u_id"]}"`, (err, result) => {
                        req.user = result[0]
                        next()
                    })
                else
                    next()
            } else {
                next()
            }
        })
    } else {
        next()
    }
}