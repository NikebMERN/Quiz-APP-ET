// models/userModel.js
const db = require("../config/database");

const updateUserIqPoints = async (userId, newIqPoints) => {
    try {
        const query = "UPDATE users SET IQpoint = ? WHERE id = ?";
        await db.query(query, [newIqPoints, userId]);
        return true;
    } catch (error) {
        console.error("Error updating IQ points:", error);
        return false;
    }
};

module.exports = { updateUserIqPoints };
