import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { QuizResult } from '../models/QuizResult.js';

const router = express.Router();

// Save quiz result
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const quizData = {
      ...req.body,
      userId: req.userId
    };

    const quizResult = new QuizResult(quizData);
    await quizResult.save();

    res.status(201).json(quizResult);
  } catch (error) {
    console.error('Save quiz result error:', error);
    res.status(500).json({ error: 'Помилка збереження результату тесту' });
  }
});

// Get quiz results for a material
router.get('/material/:materialId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const results = await QuizResult.find({
      userId: req.userId,
      materialId: req.params.materialId
    }).sort({ completedAt: -1 });

    res.json(results);
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ error: 'Помилка отримання результатів тестів' });
  }
});

// Get all quiz results for user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const results = await QuizResult.find({ userId: req.userId })
      .sort({ completedAt: -1 })
      .limit(20);

    res.json(results);
  } catch (error) {
    console.error('Get all quiz results error:', error);
    res.status(500).json({ error: 'Помилка отримання результатів' });
  }
});

// Get quiz statistics
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const results = await QuizResult.find({ userId: req.userId });

    const stats = {
      totalQuizzes: results.length,
      averageScore: results.length > 0 
        ? results.reduce((sum, r) => sum + r.scorePercentage, 0) / results.length 
        : 0,
      totalQuestions: results.reduce((sum, r) => sum + r.totalQuestions, 0),
      totalCorrect: results.reduce((sum, r) => sum + r.correctAnswers, 0)
    };

    res.json(stats);
  } catch (error) {
    console.error('Get quiz stats error:', error);
    res.status(500).json({ error: 'Помилка отримання статистики' });
  }
});

export default router;
