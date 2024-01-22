const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Middleware to authenticate user
exports.authenticateUser = (req, res, next) => {
    // Extract the token from the request header
    const token = req.header("x-auth-token");

    // Check if token is present
    if (!token) {
        return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        // Attach the decoded user information to the request object
        req.user = decoded.user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error verifying token:", error.message);
        res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
};

// Middleware to check if the user is an admin
// exports.checkAdminRole = (req, res, next) => {
//     // Assuming you have a user role stored in the user object
//     if (req.user && req.user.role === "admin") {
//         next(); // User is an admin, proceed to the next middleware or route handler
//     } else {
//         res.status(403).json({ error: "Forbidden - Admin access required" });
//     }
// };
