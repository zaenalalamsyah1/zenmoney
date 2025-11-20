import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

// Use gemini-2.5-flash for speed and efficiency with text analysis
const MODEL_NAME = 'gemini-2.5-flash';

const getApiKey = (): string | undefined => {
  // 1. Try Vite environment variable (Standard for Vite apps on Vercel)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  
  // 2. Try standard process.env (Node.js / Webpack / Custom builds)
  // Safe check to prevent "process is not defined" error in pure browser environments
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }

  return undefined;
};

const getSystemInstruction = (transactions: Transaction[]) => {
  const transactionSummary = JSON.stringify(transactions.slice(0, 100)); // Limit context to recent 100
  
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
  const apiKey = getApiKey();

  if (!apiKey) {
    return "Please configure your API Key in Vercel. Add 'VITE_API_KEY' with your AIza... key in Settings > Environment Variables, then Redeploy.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userQuery,
      config: {
        systemInstruction: getSystemInstruction(transactions),
        temperature: 0.7, 
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const msg = error.message || JSON.stringify(error);
    
    if (msg.includes('403')) return "Access Denied (403). Please check if your API Key is valid and has credits.";
    if (msg.includes('400')) return "Invalid Request (400). The API Key might be malformed.";
    
    return `Sorry, I'm having trouble connecting to the financial brain right now. (Error: ${msg.substring(0, 50)}...)`;
  }
};