const db = require("../config/database");

// Controller to get all questions
exports.getAllQuestions = (req, res) => {
    const query = "SELECT * FROM questions ORDER BY created_at DESC";

    db.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching questions:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        for (let i = 0; i < results.length; i++) {
            try {
                results[i].choices = JSON.parse(results[i].choices);
            } catch (error) {
                console.error("Error parsing choices for question:", results[i].id);
                console.error(error);
                // Handle parsing errors appropriately (e.g., log, send error response)
            }
        }

        res.json(results)
    });
};

// Controller to get a specific question by ID
exports.getQuestionById = (req, res) => {
    const questionId = req.params.id;
    const query = "SELECT * FROM questions WHERE id = ?";

    db.query(query, [questionId], (error, results) => {
        if (error) {
            console.error("Error fetching question by ID:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Question not found" });
        }

        res.json(results[0]);
    });
};

// Controller to add a new question
exports.addQuestion = (req, res) => {
    // Extract questions from the request body
    const { questions, adminId } = req.body;

    // Check if the admin has the necessary privileges (you can implement more sophisticated checks)
    if (!adminId) {
        return res.status(403).json({ error: "Permission denied" });
    }

    // Validate that there are at least 40 questions
    if (!Array.isArray(questions)) {
        return res
            .status(400)
            .json({ error: "You must provide them in JSON format" });
    }

    // Assuming questions is an array of objects with required properties (subject, question, choices, correctChoice)
    // Validate the structure of each question object

    // You can perform more validation based on your specific requirements

    // Insert questions into the database
    const insertQuery =
        "INSERT INTO questions (subject, question, choices, correct_choice) VALUES ";

    // Prepare values for the query
    const values = [];

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        // Validate the structure of each question object
        if (
            !question.subject ||
            !question.question ||
            !question.choices ||
            !question.correctChoice
        ) {
            return res.status(400).json({ error: "Invalid question structure" });
        }

        // Push values for the query
        values.push([
            question.subject,
            question.question,
            JSON.stringify(question.choices),
            question.correctChoice,
        ]);
    }

    // Generate the dynamic part of the query
    const valuePlaceholders = values.map(() => "(?, ?, ?, ?)").join(",");

    // Concatenate the dynamic query with the static part
    const fullQuery = `${insertQuery}${valuePlaceholders}`;

    // Flatten the values array to use it with the query
    const flatValues = values.reduce((acc, val) => acc.concat(val), []);

    // Execute the query
    db.query(fullQuery, flatValues, (error) => {
        if (error) {
            console.error("Error uploading model questions:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json({
            message: "Model questions uploaded successfully",
            token: adminId,
        });
    });
};

// Controller to delete a question by ID
exports.deleteQuestion = (req, res) => {
    const questionId = req.params.id;
    const query = "DELETE FROM questions WHERE id = ?";

    db.query(query, [questionId], (error) => {
        if (error) {
            console.error("Error deleting question:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json({ message: "Question deleted successfully" });
    });
};
