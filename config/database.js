const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});

// Connect to the database
db.connect((error) => {
    if (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }

    console.log("Connected to the database");

    // Call the function to create tables
    createTables();
});

// Function to create tables
// Function to create tables
function createTables() {
    const createUserTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        registration_number INT(7) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        woreda_number INT(2) NOT NULL,
        school_name VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        gender VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        iq_points INT DEFAULT 0
      )
    `;

    const createAdminTableQuery = `
      CREATE TABLE IF NOT EXISTS admin (
        id INT PRIMARY KEY AUTO_INCREMENT,
        password VARCHAR(255) NOT NULL
      )
    `;

    const createQuestionsTableQuery = `
      CREATE TABLE IF NOT EXISTS questions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        subject VARCHAR(255) NOT NULL,
        question TEXT NOT NULL,
        choices JSON NOT NULL,
        correct_choice VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Execute queries to create tables
    db.query(createUserTableQuery, (error) => {
        if (error) {
            console.error("Error creating users table:", error);
        } else {
            console.log("Users table created successfully");
        }
    });

    db.query(createAdminTableQuery, (error) => {
        if (error) {
            console.error("Error creating admin table:", error);
        } else {
            console.log("Admin table created successfully");
        }
    });

    db.query(createQuestionsTableQuery, (error) => {
        if (error) {
            console.error("Error creating questions table:", error);
        } else {
            console.log("Questions table created successfully");
        }
    });
}

module.exports = db;
