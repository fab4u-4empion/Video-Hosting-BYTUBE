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
    await dbPoolSync.query(`INSERT INTO sessions (s_id, s_user_id, s_key) VALUES ("${id}", "${userID}", "${sessionKey}")`)
    res.cookie("token", `${head}.${payload}.${signature}`, {secure:true, httpOnly: true, sameSite: "none", maxAge: 31536000000})
    res.json("Auth complete")
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
    await dbPoolSync.query(`INSERT INTO users (u_id, u_name, u_password, u_reg_date) VALUES ("${id}", "${data["u_name"]}", "${hash}", CURRENT_DATE)`)
    await startSession(id, res)
}

export const login = async (req, res) => {
    const data = req.body
    const error = false
    if (!data["u_name"])
        res.status(400).json("Вы не ввели имя")
    else if (!data["u_password"])
        res.status(400).json("Вы не ввели пароль")

    const [userQueryResult] = await dbPoolSync.query(`SELECT * FROM users WHERE u_name="${data["u_name"]}"`)

    if (!userQueryResult[0])
        res.status(400).json("Пользователя не существует")
    else if (!bcrypt.compareSync(data["u_password"], userQueryResult[0]["u_password"]))
        res.status(400).json("Неверный пароль")
    else
        await startSession(userQueryResult[0]["u_id"], res)
}

export const logout = async (req, res) => {
    await dbPoolSync.query(`DELETE FROM sessions WHERE s_id="${req['sessionId']}"`)
    res.cookie("token", ``, {secure:true, httpOnly: true, sameSite: "none"})
    res.send()
}

export const closeSessions = async (req, res) => {
    await dbPoolSync.query(`DELETE FROM sessions WHERE s_user_id="${req['user']['u_id']}" AND s_id!="${req['sessionId']}"`)
    const [sessions] = await dbPoolSync.query(`SELECT COUNT(*) AS count FROM sessions WHERE s_user_id="${req['user']['u_id']}"`)
    res.json({sessionsCount: sessions[0]['count']})
}

export const getUserInfo = async (req, res) => {
    req.user && res.json(req.user)
    res.status(401).json("Unauthorized")
}

export const changePassword = async (req, res) => {
    if (req['user']) {
        !req.body['oldPassword'] && res.status(400).json("Вы не ввели пароль")
        !req.body['newPassword'] && res.status(400).json("Вы не ввели новый пароль")
        const [userPassword] = await dbPoolSync.query(`SELECT u_password FROM users WHERE u_id="${req['user']['u_id']}"`)
        !bcrypt.compareSync(req.body["oldPassword"], userPassword[0]["u_password"]) && res.status(400).json("Неверный пароль")
        const hash = bcrypt.hashSync(req.body["newPassword"], bcrypt.genSaltSync(10))
        await dbPoolSync.query(`UPDATE users SET u_password="${hash}" WHERE u_id="${req['user']['u_id']}"`)
        res.send()
    } else {
        res.status(401).json("Unauthorized")
    }
}

export const auth = (req, res, next) => {
    if (req.cookies['token']) {
        const tokenParts = req.cookies['token']
            .split('.')
        const session = JSON.parse(
            Buffer
                .from(tokenParts[1], "base64")
                .toString("utf-8")
        )
        req.sessionId = session.id
        dbPool.query(`SELECT s_key, s_user_id FROM sessions WHERE s_id="${session.id}"`, (err, sessionInfo) => {
            if (sessionInfo[0]) {
                const signature = crypto
                    .createHmac('SHA256', sessionInfo[0]["s_key"])
                    .update(`${tokenParts[0]}.${tokenParts[1]}`)
                    .digest('base64')
                if (signature === tokenParts[2])
                    dbPool.query(`SELECT u_id, u_name FROM users WHERE u_id="${sessionInfo[0]["s_user_id"]}"`, (err, result) => {
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