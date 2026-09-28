import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK with required telemetry header User-Agent: aistudio-build
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Route: AI Agent Chat & Training Playground
app.post('/api/agent/chat', async (req, res) => {
  try {
    const {
      message,
      history = [],
      systemInstruction = '',
      fewShotExamples = [],
      transitContext = {},
      temperature = 0.7,
    } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    // Build system prompt with transit context, few-shot training examples, and custom instructions
    const defaultInstructions = `You are "RTC LiveTrack AI Agent" (also known as "Vani / RTC Navigator"), an expert, polite, and highly accurate public transportation assistant and dispatcher for the RTC bus network.
You have real-time live access to the RTC transit network.
Commuters and students ask you about bus numbers (e.g. 28, 10K, 38A, 500, 222, 6A, 400N, 999 Metro EV), live ETAs, current bus locations, delays, routes, bus stops, fares, student/senior concessions, and accessibility.

Guidelines:
1. Always be helpful, concise, and structured.
2. If the user asks about a specific bus, quote its current status, location, speed, and ETA from the provided Real-Time Context.
3. Suggest the best corridor or bus transfers if someone asks how to travel from one stop to another.
4. Support English, Telugu (తెలుగు), and Hindi when requested.
5. If the user is training you or asking about your behavior, respond according to your trained persona and guidelines.`;

    const fullSystemInstruction = `${defaultInstructions}\n\n[USER CUSTOM AGENT INSTRUCTIONS & TRAINING RULES]:\n${systemInstruction || 'Standard polite transit guide'}\n\n[CURRENT REAL-TIME TRANSIT SYSTEM CONTEXT]:\n${JSON.stringify(
      transitContext,
      null,
      2
    )}`;

    // Build contents array including few-shot examples and conversation history
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Inject few-shot training examples if provided
    if (Array.isArray(fewShotExamples)) {
      fewShotExamples.forEach((ex: { userPrompt: string; agentResponse: string }) => {
        if (ex.userPrompt && ex.agentResponse) {
          contents.push({ role: 'user', parts: [{ text: ex.userPrompt }] });
          contents.push({ role: 'model', parts: [{ text: ex.agentResponse }] });
        }
      });
    }

    // Append conversation history
    if (Array.isArray(history)) {
      history.slice(-8).forEach((h: { role: 'user' | 'model'; text: string }) => {
        if (h.role && h.text) {
          contents.push({ role: h.role, parts: [{ text: h.text }] });
        }
      });
    }

    // Append current user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    // Call Gemini API if API key is present
    if (apiKey) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: fullSystemInstruction,
          temperature: Math.max(0.1, Math.min(1.0, temperature)),
        },
      });

      const responseText = response.text || 'I am tracking the live RTC fleet. How may I assist your commute?';
      res.json({ response: responseText });
      return;
    }

    // Smart Local Grounded Transit Fallback if GEMINI_API_KEY is unset in local sandbox
    const q = message.toLowerCase();
    let reply = '';

    if (q.includes('28')) {
      reply = `**Bus 28 (RTC Complex ⇄ Gajuwaka)** is currently near **NAD Junction South Flyover**, heading south at **34 km/h**. It is **On Time** with an estimated destination arrival of **8 minutes** and **3 stops remaining**. Occupancy is Medium (16 seats available).`;
    } else if (q.includes('10k') || q.includes('kailasagiri')) {
      reply = `**Bus 10K (RTC Complex ⇄ Kailasagiri)** is a 100% **Electric AC Metro** bus near **MVP Colony Circle**, traveling at **28 km/h**. Status is **On Time** with destination ETA of **4 minutes**. It has 26 seats available and full wheelchair accessibility.`;
    } else if (q.includes('38a') || q.includes('simhachalam')) {
      reply = `**Bus 38A (RTC Complex ⇄ Simhachalam)** is at **Maddilapalem Junction**, traveling at **32 km/h**. Destination ETA to Simhachalam Hill Base is **11 minutes** with 4 stops remaining.`;
    } else if (q.includes('500') || q.includes('anakapalli')) {
      reply = `**Bus 500 (RTC Complex ⇄ Anakapalli)** is currently near **Gajuwaka Industrial Corridor** at **42 km/h**. It is currently **Delayed by 8 minutes** due to road maintenance near NAD Flyover. Expected destination ETA is **18 minutes**.`;
    } else if (q.includes('fare') || q.includes('ticket') || q.includes('pass')) {
      reply = `RTC city corridor fares range from **₹10 to ₹40** depending on the route and bus type (City Ordinary vs Deluxe/AC Electric). Digital student and senior citizen passes with QR verification are accepted on all corridors!`;
    } else if (q.includes('near') || q.includes('stop')) {
      reply = `Key nearby RTC hubs include **RTC Complex Central Terminal (Platform 4 & 5)**, **NAD Junction (Flyover Hub)**, **Maddilapalem Station**, and **MVP Colony Circle**. You can click the "Bus Stops" tab to see walking times and upcoming arrivals.`;
    } else {
      reply = `Hello! I am your **RTC LiveTrack AI Assistant**. Currently monitoring **1,248 active buses** across **186 routes**. You can ask me to track any bus (e.g. Bus 28, 10K, 38A, 500), check stop ETAs, route schedules, or test my training rules!`;
    }

    res.json({ response: reply });
  } catch (err: any) {
    console.error('AI Agent error:', err);
    res.status(500).json({
      error: err.message || 'Failed to process AI agent response.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`RTC LiveTrack Server with AI Agent running at http://0.0.0.0:${port}`);
  });
}

startServer();
