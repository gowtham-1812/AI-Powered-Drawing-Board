import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Serve static files from the public folder
app.use(express.static("../public"));

const genAIModel = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAIModel.getGenerativeModel({ model: "gemini-1.5-pro" });

app.post("/recognize", async (req, res) => {
    try {
        const imageData = req.body.imageData; // Get base64 image data from request body
        
        const result = await model.generateContent([
            "What is drawn in this image?",
            {
                inlineData: {
                    mimeType: "image/png",
                    data: imageData,
                },
            },
        ]);
        
        const response = await result.response;
        res.json({ message: response.text() });
    } catch (error) {
        console.error("Recognition failed:", error);
        res.status(500).json({ message: "Recognition failed. Please try again." });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});