const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Public route for getting all questions
router.get('/questions', questionController.getAllQuestions);

// Public route for getting a specific question by ID
router.get('/questions/:id', questionController.getQuestionById);

// Example route for adding a new question
router.post('/add-question', questionController.addQuestion);

// Private route for deleting a question (requires authentication and admin role)
router.delete('/delete-question/:id', questionController.deleteQuestion);

module.exports = router;
