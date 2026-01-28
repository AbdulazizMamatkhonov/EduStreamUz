
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
  avatar: { type: String, default: 'https://i.pravatar.cc/150' },
  subscription: { type: String, enum: ['Free', 'Basic', 'Pro', 'Enterprise'], default: 'Free' }
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teacherName: String,
  thumbnail: String,
  category: String,
  language: String,
  isGroup: { type: Boolean, default: true },
  price: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  studentsCount: { type: Number, default: 0 },
  nextSession: Date,
  zoomLink: String
});

const QuizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: { type: String, required: true },
  description: String,
  questions: [{
    type: { type: String, enum: ['multiple-choice', 'text-box'] },
    question: String,
    hint: String,
    points: Number,
    options: [String],
    correctOptionIndex: Number,
    correctAnswerText: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const HomeworkSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: String,
  description: String,
  type: { type: String, enum: ['text', 'file'] },
  dueDate: Date
});

export const User = mongoose.model('User', UserSchema);
export const Course = mongoose.model('Course', CourseSchema);
export const Quiz = mongoose.model('Quiz', QuizSchema);
export const Homework = mongoose.model('Homework', HomeworkSchema);
