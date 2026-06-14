import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, branch, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      branch,
      year,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/auth/profile
export const getProfile = async (req, res) => {
  const user = req.user;

  let examCountdown = null;
  if (user.stats?.nextExamDate) {
    const now = new Date();
    const examDate = new Date(user.stats.nextExamDate);
    const diffDays = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));
    examCountdown = diffDays >= 0 ? `${diffDays}d` : 'Past';
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    branch: user.branch,
    year: user.year,
    rollNumber: user.rollNumber,
    stats: {
      attendancePercent: user.stats?.attendancePercent ?? 0,
      cgpa: user.stats?.cgpa ?? 0,
      examCountdown,
    },
  });
};

// @route PUT /api/auth/stats
export const updateStats = async (req, res) => {
  try {
    const { attendancePercent, cgpa, nextExamDate, rollNumber, branch, year } = req.body;

    const user = req.user;

    if (attendancePercent !== undefined) user.stats.attendancePercent = attendancePercent;
    if (cgpa !== undefined) user.stats.cgpa = cgpa;
    if (nextExamDate !== undefined) user.stats.nextExamDate = nextExamDate;
    if (rollNumber !== undefined) user.rollNumber = rollNumber;
    if (branch !== undefined) user.branch = branch;
    if (year !== undefined) user.year = year;

    await user.save();

    res.status(200).json({ message: 'Stats updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};