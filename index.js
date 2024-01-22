console.clear();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const questRouter = require("./routes/questionRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRouter); // Assume your routes are under /api
app.use("/api/admin", adminRouter); // Assume your routes are under /api
app.use("/api/quest", questRouter); // Assume your routes are under /api

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
