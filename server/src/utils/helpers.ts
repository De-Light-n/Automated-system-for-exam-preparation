import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const calculateLevel = (xp: number): string => {
  if (xp > 3000) return 'Професор';
  if (xp > 1500) return 'Магістр';
  if (xp > 500) return 'Бакалавр';
  return 'Студент';
};

export const updateStreak = (lastActiveDate?: Date): { streak: number; lastActiveDate: Date } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (!lastActiveDate) {
    return { streak: 1, lastActiveDate: now };
  }

  const lastActive = new Date(lastActiveDate);
  const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
  
  const diffTime = today.getTime() - lastActiveDay.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same day, no change
    return { streak: 0, lastActiveDate }; // Will be handled by controller
  } else if (diffDays === 1) {
    // Consecutive day
    return { streak: 1, lastActiveDate: now };
  } else {
    // Streak broken
    return { streak: 1, lastActiveDate: now };
  }
};
