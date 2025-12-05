import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedIdea } from "../types";

// NOTE: In a real environment, never expose API keys on the client side.
// This is structured to use the environment variable as per instructions.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMarketingIdeas = async (
  context: string,
  goal?: string
): Promise<GeneratedIdea[]> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning mock data.");
    return [
      { title: "Mock Idea 1", pitch: "Please set API Key", visuals: "None" }
    ];
  }

  const modelId = "gemini-2.5-flash"; // Good for creative text tasks
  
  const systemInstruction = `
    You are the Macdonald Hotels Creative Workbench Engine (MH-CWE). 
    Your role is to act as a creative partner for high-end luxury hotel marketing.
    The brand values are: Luxury, Heritage, Scottish Roots, Sophistication, Relaxation.
    Generate specific, high-impact marketing campaign ideas based on the user's input.
  `;

  const prompt = `
    User Context: ${context}
    ${goal ? `Target Goal: ${goal}` : ''}
    
    Please generate 5 distinct creative ideas.
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A catchy title for the campaign" },
        pitch: { type: Type.STRING, description: "A 2-sentence elevator pitch" },
        visuals: { type: Type.STRING, description: "Description of the visual imagery (e.g. 'Couple walking in highlands')" }
      },
      required: ["title", "pitch", "visuals"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as GeneratedIdea[];

  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};
