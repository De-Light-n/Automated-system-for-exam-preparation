import express from 'express';
import { body } from 'express-validator';
import { User } from '../models/User.js';
import { generateToken, hashPassword, comparePassword } from '../utils/helpers.js';

const router = express.Router();

// Register
router.post('/register',
  [
    body('email').isEmail().withMessage('Невірний email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль повинен містити мінімум 6 символів'),
    body('username').trim().notEmpty().withMessage('Ім\'я користувача обов\'язкове')
  ],
  async (req, res) => {
    try {
      const { email, password, username } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Користувач з таким email вже існує' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        username,
        stats: {
          xp: 0,
          level: 'Студент',
          streak: 0,
          achievements: [],
          cardsLearned: 0,
          testsPassed: 0
        }
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id.toString());

      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          stats: user.stats
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Помилка при реєстрації' });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().withMessage('Невірний email'),
    body('password').notEmpty().withMessage('Пароль обов\'язковий')
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Невірний email або пароль' });
      }

      // Check password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Невірний email або пароль' });
      }

      // Generate token
      const token = generateToken(user._id.toString());

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          stats: user.stats
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Помилка при вході' });
    }
  }
);

export default router;
