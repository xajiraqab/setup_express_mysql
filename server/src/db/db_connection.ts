import mysql2 from "mysql2/promise"

const pool: mysql2.Pool = mysql2.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
})

export default pool
