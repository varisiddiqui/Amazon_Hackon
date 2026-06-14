import { GoogleGenerativeAI } from '@google/generative-ai';
import Activity from '../models/Activity.js';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// @route POST /api/ai/chat
export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Fetch user's pending activities for personalized context
    const activities = await Activity.find({
      user: req.user._id,
      status: 'pending',
    }).sort({ deadline: 1 }).limit(10);

    const contextLines = activities.map(a =>
      `- [${a.type}] ${a.task} (Room: ${a.room || 'N/A'}, Deadline: ${a.deadline.toISOString()})`
    ).join('\n') || 'No pending activities.';

    const systemPrompt = `You are a smart, friendly campus AI assistant for an Indian engineering college student named ${req.user.name} (${req.user.branch || 'N/A'}, Year ${req.user.year || 'N/A'}). You help with class schedules, assignment deadlines, events, placement prep, attendance, hostel notices, and general student life. Be concise (2-4 sentences max), warm, practical, and use occasional emojis. Speak like a helpful senior student.

Here is the student's current pending activities:
${contextLines}`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};