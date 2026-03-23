import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your real API key (See security note below!)
const API_KEY = "AIzaSyBxOn5fdeDJiEIip5yeCNFyQ-5q5kv7-Pw"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (userPrompt) => {
  try {
    // We use gemini-1.5-flash because it is fast and cost-effective for chatbots
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      // System instructions give the bot its "Premium AI Tutor" personality
      systemInstruction: "You are the INTELEARN AI Tutor. Be concise, encouraging, and explain complex topics simply for students.",
    });

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble thinking right now. Could you try asking that again?";
  }
};