
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API client following strict guidelines: use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiTutorResponse = async (userPrompt: string, history: { role: string, parts: { text: string }[] }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: "You are EduStream Assistant, a friendly and knowledgeable academic tutor for an online streaming school. Help students with their courses, explain complex topics simply, and encourage them to attend their live sessions.",
        temperature: 0.7,
      },
    });

    // Directly access the .text property from GenerateContentResponse
    return response.text || "I'm sorry, I couldn't process that. Can you try again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The tutor is currently resting. Please try again in a moment.";
  }
};
