import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { model, messages, temperature, response_format } = req.body;

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OpenRouter API key not configured on server' });
    }

    const payload: any = {
      model: model || 'x-ai/grok-4.1-fast',
      messages,
      temperature: temperature || 0.7,
      reasoning: { enabled: true }
    };

    if (response_format) payload.response_format = response_format;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.json(data);
  } catch (error: any) {
    console.error('OpenRouter proxy error:', error.message || error);
    res.status(500).json({ error: error.message || 'Proxy error' });
  }
});

export default router;
