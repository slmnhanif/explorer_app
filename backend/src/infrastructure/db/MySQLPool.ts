// src/infrastructure/db/MySQLPool.ts

import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',      // sesuaikan
  password: '',      // sesuaikan bila perlu
  database: 'explorer_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})
