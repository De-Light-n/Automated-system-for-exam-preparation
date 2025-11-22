import mongoose, { Schema, Document } from 'mongoose';

interface IQuizAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
}

export interface IQuizResult extends Document {
  userId: mongoose.Types.ObjectId;
  materialId: mongoose.Types.ObjectId;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  feedback: string;
  answers: IQuizAnswer[];
  completedAt: Date;
  createdAt: Date;
}

const quizResultSchema = new Schema<IQuizResult>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  materialId: {
    type: Schema.Types.ObjectId,
    ref: 'StudyMaterial',
    required: true,
    index: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  scorePercentage: {
    type: Number,
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  answers: [{
    questionId: { type: String, required: true },
    userAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for analytics
quizResultSchema.index({ userId: 1, completedAt: -1 });

export const QuizResult = mongoose.model<IQuizResult>('QuizResult', quizResultSchema);
