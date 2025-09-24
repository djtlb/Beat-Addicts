import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.OPENAI_PROXY_PORT || 5178;
const OPENAI_KEY = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

if (!OPENAI_KEY) {
  console.warn('⚠️  OpenAI key not found in environment. Set VITE_OPENAI_API_KEY or OPENAI_API_KEY in .env');
}

app.post('/api/openai/chat', async (req, res) => {
  try {
    const { model = 'gpt-4', messages = [], ...options } = req.body;

    if (!OPENAI_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured on server' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({ model, messages, ...options }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy failed', details: String(err) });
  }
});

app.listen(port, () => {
  console.log(`OpenAI proxy listening at http://localhost:${port}`);
  console.log('Endpoint: POST /api/openai/chat');
});
