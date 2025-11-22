import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { StudyMaterial } from '../models/StudyMaterial.js';

const router = express.Router();

// Get all materials for current user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const materials = await StudyMaterial.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-originalContent'); // Don't send full content in list

    res.json(materials);
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ error: 'Помилка отримання матеріалів' });
  }
});

// Get single material
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const material = await StudyMaterial.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!material) {
      return res.status(404).json({ error: 'Матеріал не знайдено' });
    }

    res.json(material);
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({ error: 'Помилка отримання матеріалу' });
  }
});

// Create new material
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const materialData = {
      ...req.body,
      userId: req.userId
    };

    const material = new StudyMaterial(materialData);
    await material.save();

    res.status(201).json(material);
  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({ error: 'Помилка створення матеріалу' });
  }
});

// Update material (e.g., flashcard progress)
router.patch('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const material = await StudyMaterial.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!material) {
      return res.status(404).json({ error: 'Матеріал не знайдено' });
    }

    // Update fields
    Object.assign(material, req.body);
    await material.save();

    res.json(material);
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({ error: 'Помилка оновлення матеріалу' });
  }
});

// Update single flashcard status
router.patch('/:id/flashcards/:cardId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, nextReview } = req.body;
    
    const material = await StudyMaterial.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!material) {
      return res.status(404).json({ error: 'Матеріал не знайдено' });
    }

    const card = material.flashcards.find(c => c.id === req.params.cardId);
    if (!card) {
      return res.status(404).json({ error: 'Картку не знайдено' });
    }

    card.status = status;
    if (nextReview) card.nextReview = nextReview;

    await material.save();

    res.json(card);
  } catch (error) {
    console.error('Update flashcard error:', error);
    res.status(500).json({ error: 'Помилка оновлення картки' });
  }
});

// Delete material
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const material = await StudyMaterial.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!material) {
      return res.status(404).json({ error: 'Матеріал не знайдено' });
    }

    res.json({ message: 'Матеріал видалено' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ error: 'Помилка видалення матеріалу' });
  }
});

export default router;
