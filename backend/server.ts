
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Standard import without extension for local module resolution
import { User, Course, Quiz, Homework } from './models';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_super_secret_key_123';

// Fix: Explicitly cast middleware to any to prevent TypeScript overload resolution errors
app.use(cors() as any);
// Fix: Resolve line 14 error: 'Argument of type 'NextHandleFunction' is not assignable to parameter of type 'PathParams'.'
app.use(express.json() as any);

app.get('/', (req, res) => {
  res.json({ status: 'EduStream Backend Online' });
});

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/edustream');
    console.log('✅ Connected to local MongoDB');
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed. Make sure MongoDB is running locally.');
  }
};

connectDB();

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
    res.status(500).json({ error: 'Server error' });
  }
});

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
