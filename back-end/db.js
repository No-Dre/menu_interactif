import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({path:"../.env"});

export async function initDB() {
    // try to initialize the db
    try {
        // try to create a connection to db
        console.log("connection to the db...");
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
        });

        // if the base doesn't already exist, create it
        await connection.query("CREATE DATABASE IF NOT EXISTS ma_base");

        // connection to the base
        await connection.changeUser({ database: "ma_base" });
        console.log("Connecté à MySQL !");

        //if a table aren't already exist, create it
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fname VARCHAR(255) NOT NULL,
                lname VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL
            )
        `);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS resources (
                language INT,
                level VARCHAR(255) NOT NULL,
                resourceName VARCHAR(255) NOT NULL,
                subjectField VARCHAR(255) NOT NULL,
                link VARCHAR(255) NOT NULL,
                room VARCHAR(255) NOT NULL,
                id INT
            )
        `);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS language (
                language VARCHAR(255) NOT NULL,
                id INT
            )
        `);

        // return the success
        console.log("Tables vérifiées / créées !");
        return connection;
    } catch (err) {
        // if a call with the db fail, return an error
        console.log("Error during database connection: ", err);
        return null;
    }
}