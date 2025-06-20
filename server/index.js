require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models
const QuizResult = mongoose.model('QuizResult', new mongoose.Schema({
  questions: Array,
  answers: Array,
  score: Number,
  createdAt: { type: Date, default: Date.now }
}));

// Generate quiz questions
app.post('/api/quiz', async (req, res) => {
  const { difficulty, numQuestions } = req.body;
  try {
    const prompt = `Generate ${numQuestions} ${difficulty} quiz questions with 4 options and one correct answer. Return as JSON array.`;
    const result = await genAI.generate({ prompt });
    const questions = JSON.parse(result.text());
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate questions.' });
  }
});

// Submit answers and save result
app.post('/api/quiz/submit', async (req, res) => {
  const { questions, answers } = req.body;
  let score = 0;
  questions.forEach((q, i) => {
    if (q.correct === answers[i]) score++;
  });
  const quizResult = new QuizResult({ questions, answers, score });
  await quizResult.save();
  res.json({ score });
});

// Get quiz report
app.post('/api/quiz/report', async (req, res) => {
  const { questions, answers } = req.body;
  const report = questions.map((q, i) => ({
    question: q.question,
    correct: q.correct,
    yourAnswer: answers[i],
    isCorrect: q.correct === answers[i]
  }));
  res.json({ report });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 