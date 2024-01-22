const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../config/database");
const { updateUserIqPoints } = require("../Model/userIQModel");

dotenv.config();

// Controller to register a new user
exports.registerUser = async (req, res) => {
    const {
        email,
        registrationNumber,
        name,
        woredaNumber,
        schoolName,
        city,
        age,
        gender,
        password,
    } = req.body;

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
        "INSERT INTO users (email, registration_number, name, woreda_number, school_name, city, age, gender, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(
        query,
        [
            email,
            registrationNumber,
            name,
            woredaNumber,
            schoolName,
            city,
            age,
            gender,
            hashedPassword,
        ],
        (error, results) => {
            if (error) {
                console.error("Error registering user:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            // Create and sign a JWT for the newly registered user
            const token = jwt.sign(
                { user: { id: results.insertId } },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.status(201).json({ message: "User registered successfully", token });
        }
    );
};

// Controller to log in a user
exports.loginUser = async (req, res) => {
    const { email, registrationNumber, password } = req.body;
    const query =
        "SELECT * FROM users WHERE email = ? OR registration_number = ?";

    db.query(query, [email, registrationNumber], async (error, results) => {
        if (error) {
            console.error("Error logging in user:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = results[0];

        // Compare the entered password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Create and sign a JWT for the logged-in user
        const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
            expiresIn: "6h",
        });

        res.json({ message: "Login successful", token });
    });
};

// Controller to get user information
exports.getUserInfo = (req, res) => {
    const userId = req.user.id;
    const query =
        "SELECT id, email, registration_number, name, woreda_number, school_name, city, age, gender, IQpoint FROM users WHERE id = ?";

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error("Error fetching user information:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = results[0];
        res.json(user);
    });
};

// Controller to get all users information
exports.getAllUserInfo = (req, res) => {
    const query = "SELECT * FROM users";

    db.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching user information:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const user = results;
        res.json(user);
    });
};

// Controller to update user IQ point
exports.updateIqPoints = async (req, res) => {
    const { userId, newIqPoints } = req.body;

    if (!userId || !newIqPoints) {
        return res
            .status(400)
            .json({ error: "userId and newIqPoints are required." });
    }

    const success = await updateUserIqPoints(userId, newIqPoints);

    if (success) {
        res.status(200).json({ message: "IQ points updated successfully." });
    } else {
        res
            .status(500)
            .json({ error: "Internal server error. Unable to update IQ points." });
    }
};
