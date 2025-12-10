import { GoogleGenAI, GenerateContentResponse, Chat, Type, Schema } from "@google/genai";
import { Message, FileAttachment } from "../types";

// Initialize client
// API key must be obtained exclusively from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a friendly, encouraging, and highly intelligent AI study coach for students.
Your goal is to help them learn, organize their life, and stay motivated.

Rules:
1. Be friendly and supportive. Use emojis occasionally.
2. Do NOT provide direct answers to homework questions if it looks like cheating. Instead, explain the concept step-by-step and guide the user to the answer.
3. If the user asks for a summary, flashcards, or quiz, generate them in a structured format.
4. Reference the user's uploaded notes if context is provided.
5. Never hallucinate facts. If you don't know, admit it.
6. Offer specific "suggested actions" like "Create Flashcards" or "Add to Study Plan" when relevant.
`;

export const createChatSession = () => {
  try {
    return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  } catch (error) {
    console.error("Failed to create chat session:", error);
    return null;
  }
};

export const sendMessageStream = async (
  chat: Chat, 
  text: string, 
  attachments: FileAttachment[] = []
): Promise<AsyncIterable<GenerateContentResponse>> => {
  
  // Prepare contents
  const parts: any[] = [];
  
  // Add attachments first
  attachments.forEach(att => {
    // Remove data URL prefix if present for the API call
    const base64Data = att.data.includes('base64,') 
      ? att.data.split('base64,')[1] 
      : att.data;

    parts.push({
      inlineData: {
        mimeType: att.mimeType,
        data: base64Data
      }
    });
  });

  // Add text
  if (text) {
    parts.push({ text });
  }

  // Send message
  try {
    // Note: The SDK chat.sendMessageStream takes a generic object structure
    // We construct the input to match what the model expects for a turn
    return await chat.sendMessageStream({ 
        message: {
            role: 'user',
            parts: parts 
        } 
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// --- Backend Feature Implementations ---

export const generateFlashcards = async (topic: string, textContext: string) => {
    try {
        const prompt = `Generate 5-10 high-quality flashcards for the topic: "${topic}". 
        Context: ${textContext.substring(0, 10000)}.
        IMPORTANT: Ensure the content (front and back) is written in English, even if the context provided is in another language.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            front: { type: Type.STRING, description: "The question or concept on the front of the card in English" },
                            back: { type: Type.STRING, description: "The answer or explanation on the back in English" },
                            difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
                        },
                        required: ["front", "back", "difficulty"]
                    }
                }
            }
        });
        
        const text = response.text || "[]";
        return JSON.parse(text);
    } catch (e) {
        console.error("Gen flashcards error", e);
        return [];
    }
}

export const summarizeNotes = async (textContext: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize the following study notes into concise, easy-to-read bullet points in English. Highlight key terms. Context: ${textContext.substring(0, 15000)}`,
        });
        return response.text || "Could not generate summary.";
    } catch (e) {
        console.error("Summarize error", e);
        return "Failed to generate summary.";
    }
}

export const generateMotivation = async () => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Give me a short, powerful, modern motivational quote for a student in English. Include the author if known. Just return the quote text.",
        });
        return response.text || "Keep pushing forward! 🚀";
    } catch (e) {
        return "You are capable of amazing things.";
    }
}

export const generateStudyPlan = async (goals: string) => {
    try {
        const prompt = `Create a realistic study schedule for today based on these goals: "${goals}". 
        Assume the student has about 4-6 hours available. Include breaks. Output in English.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "Title of the session in English" },
                            startTime: { type: Type.STRING, description: "24h format e.g. 09:00" },
                            endTime: { type: Type.STRING, description: "24h format e.g. 10:00" },
                            type: { type: Type.STRING, enum: ["study", "break", "review"] }
                        },
                        required: ["title", "startTime", "endTime", "type"]
                    }
                }
            }
        });
        
        const text = response.text || "[]";
        return JSON.parse(text);
    } catch (e) {
        console.error("Study plan error", e);
        return [];
    }
}