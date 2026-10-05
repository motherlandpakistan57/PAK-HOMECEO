import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Initialize GoogleGenAI SDK with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.use(express.json({ limit: '25mb' }));

// 1. AI Multi-turn Chat Endpoint with Role Instructions & Search Grounding
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, userRole, language, useSearch } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const systemPrompt = `You are the official bilingual AI Voice & Strategic Assistant for PAK-HOMECEO ('Every Home Can Become an Enterprise. Every Woman Can Become a CEO').
CORE MISSION: Empower senior, experienced Pakistani matriarchs and elder women artisans, connecting their generational craft and culinary mastery with the younger generation (young entrepreneurs, business builders, students, and citizens) so they contribute meaningfully to society with dignity, self-reliance, and intergenerational warmth rather than living in loneliness.

PAK-HOMECEO connects 4 human roles:
1. Skill Partner (Kalsoom Bibi / home-based elder Pakistani craftswomen and traditional food preservers)
2. Business Builder (Zainab Malik / operations, batches, order assignment, escrow payouts)
3. Community Connector (Fatima Zehra / field material drop-offs, safety, 6-point doorstep quality checks)
4. Citizen (Amina Siddiqui / discovering authentic crafts, placing custom briefs, tracking doorstep delivery)

Current User Role: ${userRole || 'Citizen'}.
Current Language Preference: ${language === 'ur' ? 'Urdu (اردو)' : 'English / Urdu'}.

Instructions:
- Respond as quickly, accurately, and concisely as possible in the language spoken/requested (Urdu or English).
- When the user asks in Urdu or prefers Urdu, reply in natural, warm, conversational Urdu (اردو) or Roman Urdu.
- Emphasize intergenerational connection between youth and senior women elders.
- Explain things in simple, respectful, and empowering language. No charity or pity framing; women are master artisans, CEOs, and business owners.
- When assisting a Skill Partner: Explain order steps simply ("1. Raw materials delivered", "2. Handcrafted resham/ralli stitching", "3. Quality check"), and confirm that ~70% direct payment will arrive in their JazzCash/Easypaisa wallet upon customer delivery.
- When assisting a Citizen: Help them choose products, write custom order briefs (sizes, colors, delivery city), and explain the live tracking milestones.
- When assisting a Business Builder: Give concise operational insights, batch scheduling ideas, and artisan capacity updates.
- If Google Search is enabled, use search grounding for verified factual Pakistani market rates, raw silk prices, or city courier timelines.`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const config: any = {
      systemInstruction: systemPrompt,
      temperature: 0.7,
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config,
    });

    const candidate = response.candidates?.[0];
    const text = response.text || '';
    const groundingMetadata = candidate?.groundingMetadata;

    return res.json({
      text,
      groundingMetadata: groundingMetadata || null,
    });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate AI response.',
    });
  }
});

// 2. Audio Transcription Endpoint
app.post('/api/ai/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required.' });
    }

    const cleanBase64 = audioBase64.includes('base64,')
      ? audioBase64.split('base64,')[1]
      : audioBase64;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || 'audio/webm',
              },
            },
            {
              text: 'Transcribe this voice recording accurately in either Urdu or English as spoken. Return only the clean transcribed text without commentary.',
            },
          ],
        },
      ],
    });

    return res.json({
      text: response.text?.trim() || '',
    });
  } catch (error: any) {
    console.error('Audio Transcription Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to transcribe audio.',
    });
  }
});

// Mount Vite in dev mode or serve static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PAK-HOMECEO fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
