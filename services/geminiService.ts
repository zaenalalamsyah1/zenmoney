import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

// Use gemini-2.5-flash for speed and efficiency with text analysis
const MODEL_NAME = 'gemini-2.5-flash';

const getSystemInstruction = (transactions: Transaction[]) => {
  const transactionSummary = JSON.stringify(transactions.slice(0, 100)); // Limit context to recent 100 to avoid token limits
  
  return `
    You are ZenMoney AI, a helpful, friendly, and concise financial assistant.
    
    Here is the user's recent transaction history in JSON format:
    ${transactionSummary}
    
    Analyze this data to answer the user's questions. 
    - Be encouraging but realistic.
    - The user uses Indonesian Rupiah (IDR / Rp) as their currency.
    - When mentioning amounts, format them nicely (e.g. "1.5 million" or "Rp 50.000").
    - Use **bold text** for key numbers or categories.
    - Use bullet points (* or -) for lists of advice or breakdown.
    - Keep answers short (under 3 sentences unless asked for detail) as this is a mobile app.
    
    If you cannot find the answer in the data, politely say so.
  `;
};

export const generateFinancialAdvice = async (
  userQuery: string,
  transactions: Transaction[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Please configure your API Key to use the AI Advisor.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userQuery,
      config: {
        systemInstruction: getSystemInstruction(transactions),
        temperature: 0.7, 
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the financial brain right now. Please try again later.";
  }
};