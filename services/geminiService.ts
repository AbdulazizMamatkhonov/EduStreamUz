
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client with the environment variable API key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  /**
   * Generates a response from the Gemini model.
   * Uses gemini-3-flash-preview for general text assistance.
   */
  async getChatResponse(message: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message,
        config: {
          systemInstruction: 'You are EduStream AI, a friendly academic tutor for a live streaming education platform. Help students with course information, study strategies, and academic questions. Be encouraging and concise.',
        },
      });

      // The response.text property directly returns the generated string
      return response.text || "I'm sorry, I couldn't generate a helpful response at this time.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "There was an error connecting to my AI brain. Please try again later.";
    }
  }
};

export const noAi = false;
