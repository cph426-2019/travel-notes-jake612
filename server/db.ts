import * as mysql from "mysql2/promise";

export type Rows = mysql.RowDataPacket[];

// Sets up a pool of connections all ready to go and be authenticated, avoid inefficiency
export const DB: mysql.Pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    namedPlaceholders: true
});