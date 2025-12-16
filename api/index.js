// api/index.js - NEJROBUSTNĚJŠÍ VERZE PRO KOMPATIBILITU S VERCEL A NODE.JS

// Nastavení require pro GoogleGenAI:
const GoogleGenAI = require('@google/genai').GoogleGenAI; // ZMĚNA: Přistupujeme přímo ke třídě
const express = require('express');
const cors = require('cors');

// Zde se klíč načte bezpečně
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 
const app = express();

app.use(cors());
app.use(express.json());

// Testovací GET
app.get('/', (req, res) => {
    res.status(200).send('Proxy je online a funguje!');
});

// Hlavní endpoint
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
        // Tady je nejpravděpodobnější chyba kvůli špatnému API klíči (401)
        res.status(500).json({ error: 'Chyba při zpracování AI požadavku.' });
    }
});

module.exports = app;
