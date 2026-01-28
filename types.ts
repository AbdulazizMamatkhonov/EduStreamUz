export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher'
}

export enum SubscriptionPlan {
  FREE = 'Free',
  BASIC = 'Basic',
  PRO = 'Pro',
  ENTERPRISE = 'Enterprise'
}

export type AppLanguage = 'en' | 'ru' | 'uz';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  subscription?: SubscriptionPlan;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  thumbnail: string;
  category: string;
  language: AppLanguage;
  isGroup: boolean;
  price: number;
  rating: number;
  studentsCount: number;
  nextSession?: string;
  zoomLink?: string;
}

export interface Homework {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'text' | 'file';
  dueDate: string;
}

export type QuestionType = 'multiple-choice' | 'text-box';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  hint?: string;
  points: number;
  options?: string[]; // For MCQ
  correctOptionIndex?: number; // For MCQ
  correctAnswerText?: string; // For Text Box
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}