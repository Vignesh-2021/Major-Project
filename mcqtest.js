require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

// Quizgecko API Route
app.post("/quizgecko", async (req, res) => {
    const { topic, num_questions } = req.body;
    const API_URL = "https://api.quizgecko.com/v1/questions/generate";

    try {
        const response = await axios.post(API_URL, {
            text: `Generate a quiz on ${topic}.`,
            num_questions: num_questions || 5,
            difficulty: "medium",
            type: "multiple_choice"
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.QUIZGECKO_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || "Error fetching questions" });
    }
});

// AI-Based Questions Generator API (RapidAPI) Route
app.post("/ai-questions", async (req, res) => {
    const { topic, num_questions } = req.body;
    const API_URL = "https://ai-based-questions-generator.p.rapidapi.com/generate";

    try {
        const response = await axios.post(API_URL, {
            text: `Generate ${num_questions || 5} questions on ${topic}`,
            num_questions: num_questions || 5,
            difficulty: "medium",
            type: "multiple_choice"
        }, {
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "ai-based-questions-generator.p.rapidapi.com",
                "Content-Type": "application/json"
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || "Error fetching questions" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
