import express from 'express';
import AIChat from '../../models/AIChat.js';

const router = express.Router();

// Get all AI chats
router.get('/', async (req, res) => {
  const chats = await AIChat.find().populate('userId relatedTasks');
  res.json(chats);
});

// Add new AI chat
router.post('/', async (req, res) => {
  const newChat = new AIChat(req.body);
  await newChat.save();
  res.json(newChat);
});

export default router;