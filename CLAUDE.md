# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NutriApp API is a Node.js Express API that uses Google's Gemini AI to analyze food nutritional information from multiple input types (text, images, and audio). The API is deployed on Vercel as a serverless function.

## Commands

### Development
```bash
npm start                # Start the server locally on port 3000 (or PORT env var)
```

### Deployment
The project is configured for Vercel deployment. All routes are handled by `api/index.js` as a serverless function.

## Architecture

### Entry Point
- **api/index.js**: Single file containing the entire API implementation
  - Exports the Express app as default for Vercel serverless deployment
  - Also starts a local server when run directly (line 84-87)

### Key Technologies
- **Express 5.2.1**: Web framework (using ES modules syntax)
- **@google/generative-ai**: Google Gemini AI integration (model: gemini-2.5-flash-lite)
- **Multer**: File upload handling with in-memory storage
- **dotenv**: Environment variable management

### API Endpoints

#### GET /
Health check endpoint returning `{ message: "API funcionando", status: "ok" }`

#### GET /ping
Simple ping endpoint returning `{ message: "pong" }`

#### POST /analyze-food
Main endpoint for food analysis. Accepts multipart/form-data with:
- `text` (optional): Text description of food
- `image` (optional): Image file of food
- `audio` (optional): Audio file describing food

Returns JSON with nutritional information per 100g:
```json
{
  "analysis": {
    "calorias_por_100g": number,
    "proteinas_g": number,
    "grasas_g": number,
    "carbohidratos_g": number
  }
}
```

### AI Integration Pattern
The Gemini AI model is configured to return strict JSON output without markdown formatting. The code handles both raw JSON and markdown-wrapped JSON responses by using regex to extract JSON from markdown code blocks (line 70-71).

### Environment Variables
- **GEMINI_API_KEY**: Google Gemini API key (required)
- **PORT**: Server port (optional, defaults to 3000)

## Important Notes

- The project uses ES modules (`"type": "module"` in package.json)
- Node.js version 20.x is required
- File uploads are stored in memory (multer.memoryStorage()), not persisted to disk
- The `/uploads` directory exists but is not actively used in the current implementation
- All responses and prompts are in Spanish
