
import { GoogleGenAI } from "@google/genai";

const getGenAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getChatResponse = async (message: string, history: { role: string, parts: { text: string }[] }[]): Promise<string> => {
    try {
        const ai = getGenAI();
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history
        });
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error getting chat response:", error);
        throw new Error("Failed to get response from Gemini.");
    }
};
