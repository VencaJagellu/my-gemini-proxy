import GoogleGenAI from '@google/genai';
import express from 'express';
import cors from 'cors';

// Zde se klíč načte bezpečně z proměnné prostředí Vercelu
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const app = express();
app.use(cors()); 
app.use(express.json());

// Hlavní endpoint pro volání Gemini
app.post('/', async (req, res) => {
    const prompt = req.body.prompt;
    if (!prompt) {
        return res.status(400).send({ error: 'Chybí dotaz (prompt) v těle požadavku.' });
    }

    try {
        // Volání Gemini API
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // Odeslání odpovědi zpět
        res.json({ text: response.text });

    } catch (error) {
        console.error('Chyba při volání Gemini API:', error);
        res.status(500).json({ error: 'Chyba při zpracování AI požadavku.' });
    }
});

// Pro Vercel exportujeme Express aplikaci
export default app;
