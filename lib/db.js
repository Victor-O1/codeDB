import "server-only";  // file can only be imported on server side
import { Pool, QueryResult, QueryResultRow } from "pg";

const poolConfig = {
    max: 20, // set pool size to 20 connections
    idleTimeoutMillis: 10000, // close idle clients after 10 seconds
    connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERTIFICATE,
    },
};


const getPool = () => {
    // check if pool is already created as a global variable
}