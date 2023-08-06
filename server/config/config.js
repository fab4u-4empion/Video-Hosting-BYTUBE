import mysql from "mysql2";

export const dbPoolSync = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bytube"
}).promise()

export const dbPool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bytube"
})

