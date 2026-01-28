import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Be explicit with the extension to avoid resolution conflicts with root models.ts
import { User, Course, Quiz, Homework } from './models.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_super_secret_key_123';

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Basic Security Headers
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval'; img-src * data:; font-src *; connect-src *;");
  next();
});

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/edustream');
    console.log('✅ Connected to local MongoDB');
  } catch (err) {
    console.warn('⚠️ Local MongoDB not found. Backend will run, but database operations will fail.');
  }
};

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'EduStream API is online' });
});

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
    res.status(500).json({ error: 'Auth error' });
  }
});

// Course Routes
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Fetch error' });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Save error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 EduStream Backend running on http://localhost:${PORT}`);
});