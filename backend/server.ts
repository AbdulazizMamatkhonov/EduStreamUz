import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Course, Quiz, Homework } from './models.ts';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_super_secret_key_123';

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/edustream');
    console.log('✅ Connected to local MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error. Ensure MongoDB is running locally at :27017');
    console.error('Error details:', (err as Error).message);
  }
};

connectDB();

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ error: 'Database authentication error' });
  }
});

// Course Routes
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save course' });
  }
});

// Quiz Routes
app.get('/api/quizzes/:courseId', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ courseId: req.params.courseId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: 'Quiz fetch failed' });
  }
});

app.post('/api/quizzes', async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Homework Routes
app.get('/api/homework/:courseId', async (req, res) => {
  try {
    const hws = await Homework.find({ courseId: req.params.courseId });
    res.json(hws);
  } catch (err) {
    res.status(500).json({ error: 'Homework fetch failed' });
  }
});

app.post('/api/homework', async (req, res) => {
  try {
    const hw = new Homework(req.body);
    await hw.save();
    res.status(201).json(hw);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create homework' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 EduStream Backend running on http://localhost:${PORT}`);
});