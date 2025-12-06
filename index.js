import express from "express";
import multer from "multer"; // para manejar archivos (imagen/audio)
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Inicializa Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint multimodal
app.post(
  "/analyze-food",
  upload.fields([{ name: "image" }, { name: "audio" }]),
  async (req, res) => {
    try {
      const textInput = req.body?.text || "";

      const imageFile = req.files?.image?.[0];
      const audioFile = req.files?.audio?.[0];

      const imageData = imageFile ? fs.readFileSync(imageFile.path) : null;
      const audioData = audioFile ? fs.readFileSync(audioFile.path) : null;

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
      });

      const prompt = `
Analiza este alimento y devuelve SOLO un JSON con:
{
  "calorias_por_100g": ...,
  "proteinas_g": ...,
  "grasas_g": ...,
  "carbohidratos_g": ...
}
No agregues texto explicativo ni formato Markdown.
Si no reconoces el alimento, devuelve: { "calorias_por_100g": null, ... }
`;

      const inputParts = [{ text: prompt }];
      if (textInput) inputParts.push({ text: textInput });
      if (imageData)
        inputParts.push({
          inlineData: {
            data: imageData.toString("base64"),
            mimeType: imageFile.mimetype,
          },
        });
      if (audioData)
        inputParts.push({
          inlineData: {
            data: audioData.toString("base64"),
            mimeType: audioFile.mimetype,
          },
        });

      const result = await model.generateContent(inputParts);
      const rawText = result.response.text();
      const match = rawText.match(/```json\n([\s\S]*?)\n```/);
      const jsonText = match ? match[1] : rawText;

      const analysis = JSON.parse(jsonText);
      res.json({ analysis });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Error analizando alimento" });
    }
  }
);

export default app;
