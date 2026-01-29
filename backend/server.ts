
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Course, Quiz, Homework } from './models';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_super_secret_key_123';

// Fix: Explicitly cast middleware to any to prevent TypeScript overload resolution errors
app.use(cors() as any);
// Fix: Resolve line 14 error: 'Argument of type 'NextHandleFunction' is not assignable to parameter of type 'PathParams'.'
app.use(express.json() as any);

app.get('/', (_req: any, res: any) => {
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

app.post('/api/auth/login', async (req: any, res: any) => {
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

app.post('/api/auth/register', async (req: any, res: any) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student', // single role assignment
      avatar: `https://i.pravatar.cc/150?u=${email}`
    });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


const getUserFromAuthHeader = async (req: any) => {
  const authHeader = req.headers?.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const user = await User.findById(decoded.id);
    return user;
  } catch (err) {
    return null;
  }
};

app.post('/api/admin/teachers', async (req: any, res: any) => {
  try {
    const adminUser = await getUserFromAuthHeader(req);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: 'Admins only' });
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'teacher',
      avatar: `https://i.pravatar.cc/150?u=${email}`
    });
    res.status(201).json({ user: { id: user._id, name: user.name, role: user.role, email: user.email, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/courses', async (_req: any, res: any) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Fetch error' });
  }
});

app.post('/api/courses', async (req: any, res: any) => {
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
