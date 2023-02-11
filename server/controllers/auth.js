import {dbPool} from "../config/config.js";
import bcrypt from "bcrypt"

const startSession = (userID, res) => {
    console.log(userID)
}

export const registration = async (req, res) => {
    const data = req.body
    !data["u_name"] && res.status(400).json("Вы не ввели имя")
    !data["u_password"] && res.status(400).json("Вы не ввели пароль")
    !data["u_confirm_password"] && res.status(400).json("Вы не подтвердили пароль")
    data["u_password"] !== data["u_confirm_password"] && res.status(400).json("Пароли не совпадают")
    const [countQueryResult] = await dbPool.query(`SELECT COUNT(*) as count FROM users WHERE u_name="${data["u_name"]}"`)
    countQueryResult[0].count !== 0 && res.status(400).json("Имя уже занято")
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(data["u_password"], salt)
    await dbPool.query(`INSERT INTO users (u_name, u_password) VALUES ("${data["u_name"]}", "${hash}")`)
    const userIDQueryResult = await dbPool.query(`SELECT u_id from users WHERE u_name="${data["u_name"]}"`)
    startSession(userIDQueryResult[0]["u_id"], res)
}

export const login = async (req, res) => {
    const data = req.body
    !data["u_name"] && res.status(400).json("Вы не ввели имя")
    !data["u_password"] && res.status(400).json("Вы не ввели пароль")
    const [userQueryResult] = await dbPool.query(`SELECT * FROM users WHERE u_name="${data["u_name"]}"`)
    !userQueryResult[0] && res.status(400).json("Пользователя не существует")
    !bcrypt.compareSync(data["u_password"], userQueryResult[0]["u_password"]) && res.status(400).json("Неверный пароль")
    startSession(userQueryResult[0]["u_id"], res)
}