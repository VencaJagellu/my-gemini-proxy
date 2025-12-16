// api/index.js - VERZE POUŽÍVAJÍCÍ SYNTAXI require() (CommonJS)

const { GoogleGenAI } = require('@google/genai'); // Změna importu
const express = require('express');               // Změna importu
const cors = require('cors');                     // Změna importu

// Zde se klíč načte bezpečně z proměnné prostředí Vercelu
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 
const app = express();

app.use(cors());
app.use(express.json());

// Testovací GET
app.get('/', (req, res) => {
    res.status(200).send('Proxy je online a funguje!');
});

// Hlavní endpoint pro volání Gemini
app.post('/', async (req, res) => {
    const prompt = req.body.prompt;
    if (!prompt) {
        return res.status(400).send({ error: 'Chybí dotaz (prompt) v těle požadavku.' });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.json({ text: response.text });

    } catch (error) {
        console.error('Chyba při volání Gemini API:', error);
        res.status(500).json({ error: 'Chyba při zpracování AI požadavku.' });
    }
});

// Pro Vercel exportujeme Express aplikaci s module.exports
module.exports = app; // Změna exportu
