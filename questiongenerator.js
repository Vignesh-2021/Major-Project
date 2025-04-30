require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

// AI-Based Questions Generator API Route
app.post("/generate-questions", async (req, res) => {
    const { topic, num_questions } = req.body;
    const API_URL = "https://ai-based-questions-generator.p.rapidapi.com/generate";

    try {
        const response = await axios.post(API_URL, {
            text: `Generate ${num_questions || 5} questions on ${topic}`,
            num_questions: num_questions || 5,
            difficulty: "medium",  // Options: easy, medium, hard
            type: "multiple_choice" // Options: multiple_choice, true_false, short_answer
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
    console.log(`Server running on http://localhost:${PORT}`);
});
