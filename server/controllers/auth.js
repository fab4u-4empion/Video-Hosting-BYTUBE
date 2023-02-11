import {dbPool} from "../config/config.js";
import bcrypt from "bcrypt"

export const registration = (req, res) => {
    const data = req.body
    !data.u_name && res.status(400).json("Вы не ввели имя")
    !data.u_password && res.status(400).json("Вы не ввели пароль")
    !data.u_confirm_password && res.status(400).json("Вы не подтвердили пароль")
    data.u_password !== data.u_confirm_password && res.status(400).json("Пароли не совпадают")
    dbPool.query(`SELECT COUNT(*) as count FROM users WHERE u_name="${data.u_name}"`, (err, result) =>  {
        if (result[0].count === 0) {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(data.u_password, salt)
            dbPool.query(`INSERT INTO users (u_name, u_password) VALUES ("${data.u_name}", "${hash}")`, () => {
                dbPool.query(`SELECT u_id from users WHERE u_name="${data.u_name}"`, (err, result) => {
                    // TODO create session
                })
            })
        } else {
            res.status(400).json("Имя уже занято")
        }
    })
}