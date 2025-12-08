import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { GeneratedIdea, AssetVersion } from "../types";

const apiKey = process.env.API_KEY || '';
// We create instances dynamically to ensure we capture the latest key if updated via Veo flow
const getAI = () => new GoogleGenAI({ apiKey });

// --- AGENT KIM: Prompt Optimization ---
export const optimizePromptWithKim = async (
  userBrief: string,
  guidelinesActive: boolean
): Promise<string> => {
  if (!apiKey) return `(Mock Optimized) Luxury architectural shot of ${userBrief}, golden hour, cinematic lighting, 4k.`;

  const ai = getAI();
  const modelId = "gemini-2.5-flash"; // Fast and capable for grounding

  // 70% Guidelines (System Prompt), 20% Scrape (Grounding), 10% Competitors (Grounding)
  const systemInstruction = `
    You are 'Kim', the specialized Marketing AI Agent for Macdonald Hotels & Resorts.
    
    YOUR MANDATE:
    1. Transform the user's raw input into a highly detailed, photorealistic image/video generation prompt.
    2. Adhere strictly to the Macdonald Hotels Brand Voice (70% Weight):
       - Tone: Luxurious, Relaxed, Scottish Heritage, Premium.
       - Colors: Deep Greens (#0F554A), Gold (#EBB13B).
       - Style: Cinematic, High-Dynamic Range, "Soft Luxury".
    3. Incorporate real-time data (30% Weight):
       - Use Google Search to find current competitor visual trends for this topic.
       - Look up 'Macdonald Hotels' specific visual style for the requested location.
    
    OUTPUT:
    Return ONLY the optimized technical prompt string. Do not include conversational filler.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `User Brief: "${userBrief}". \n\nCreate the Master Visual Prompt.`,
      config: {
        tools: [{ googleSearch: {} }], // Enable grounding
        systemInstruction: systemInstruction,
      }
    });

    return response.text || userBrief;

  } catch (error) {
    console.error("Kim Error:", error);
    return `Macdonald Hotels Style: ${userBrief}, cinematic lighting, photorealistic, 8k resolution.`;
  }
};

// --- THINKING MODE: Concept Generation ---
export const generateCreativeConcepts = async (
  request: any,
  masterPrompt?: string
): Promise<AssetVersion[]> => {
  if (!apiKey) return mockAssets();

  const ai = getAI();
  const modelId = "gemini-3-pro-preview";

  const prompt = `
    You are the Macdonald Hotels Creative Director.
    Campaign Data: ${JSON.stringify(request)}
    Master Visual Direction (from Agent Kim): ${masterPrompt || "N/A"}
    
    Generate 20 distinct, high-impact marketing creative concepts.
    They must all align with the Master Visual Direction but offer slight variations in angle, lighting, or subject focus.
    
    For each, provide:
    - title (Catchy, short)
    - visualDescription (The technical image prompt)
    - copy (Short marketing blurb)
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        visualDescription: { type: Type.STRING },
        copy: { type: Type.STRING },
      },
      required: ["title", "visualDescription", "copy"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, // Thinking enabled for deep reasoning
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text;
    if (!text) return mockAssets();
    
    const concepts = JSON.parse(text);
    
    return concepts.map((c: any, i: number) => ({
      id: `ai-v${i+1}`,
      title: c.title,
      description: c.copy,
      imageUrl: `https://picsum.photos/800/600?random=${i}&grayscale`, // Placeholder until rendered
      format: 'image',
      stats: {
        predictedCtr: `${(2 + Math.random() * 3).toFixed(1)}%`,
        impressions: 'Pending'
      }
    }));

  } catch (error) {
    console.error("Thinking Error:", error);
    return mockAssets();
  }
};

// --- IMAGEN 3: High Quality Image Generation ---
export const generateHighQualityImage = async (
  prompt: string,
  aspectRatio: string = "16:9",
  size: string = "1K"
): Promise<string | null> => {
  if (!apiKey) return null;
  const ai = getAI();
  
  try {
    // Using generateContent for nano banana pro (gemini-3-pro-image-preview)
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `Photorealistic, 4k, cinematic shot for luxury hotel marketing. Strict Brand Colors (Green/Gold/Cream). Prompt: ${prompt}` }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: size
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Image Gen Error:", e);
    return null;
  }
};

// --- VEO: Video Generation ---
export const generateVeoVideo = async (
  prompt: string,
  imageBase64?: string,
  aspectRatio: string = "16:9"
): Promise<string | null> => {
  // 1. Check/Request Paid Key
  if (window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }

  // 2. Re-init AI with potentially new key in env (handled by aistudio injection usually, but we assume process.env.API_KEY is current)
  const ai = getAI();
  const model = "veo-3.1-fast-generate-preview";

  try {
    let operation;
    
    if (imageBase64) {
        // Image-to-Video
        operation = await ai.models.generateVideos({
            model,
            prompt: prompt, // Prompt is optional but good for guidance
            image: {
                imageBytes: imageBase64,
                mimeType: 'image/png' // Assuming PNG for simplicity, could detect
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: aspectRatio
            }
        });
    } else {
        // Text-to-Video
        operation = await ai.models.generateVideos({
            model,
            prompt: `Cinematic, slow motion, luxury hotel commercial. Macdonald Hotels Style. ${prompt}`,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: aspectRatio
            }
        });
    }

    // Polling
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
        // Fetch with key
        const vidResponse = await fetch(`${videoUri}&key=${apiKey}`);
        const blob = await vidResponse.blob();
        return URL.createObjectURL(blob);
    }
    return null;

  } catch (e) {
    console.error("Veo Error:", e);
    return null;
  }
};

// --- TTS: Generate Speech ---
export const generateVoiceover = async (text: string): Promise<string | null> => {
  if (!apiKey) return null;
  const ai = getAI();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Deep, authoritative
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return `data:audio/mp3;base64,${base64Audio}`;
    }
    return null;
  } catch (e) {
    console.error("TTS Error:", e);
    return null;
  }
};

// --- CHAT: Idea Generation with Grounding ---
export const chatWithGrounding = async (
  message: string, 
  useGrounding: boolean = false
): Promise<{ text: string, links?: string[] }> => {
  if (!apiKey) return { text: "API Key missing." };
  const ai = getAI();

  // Use Flash for grounding tasks, Pro for pure creative
  const modelId = useGrounding ? "gemini-2.5-flash" : "gemini-3-pro-preview";
  
  const tools = useGrounding ? [{ googleSearch: {} }, { googleMaps: {} }] : [];

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: message,
      config: {
        tools: tools,
        systemInstruction: "You are an expert marketing strategist for Macdonald Hotels.",
      }
    });

    const text = response.text || "";
    
    // Extract grounding URLs
    const links: string[] = [];
    response.candidates?.[0]?.groundingMetadata?.groundingChunks?.forEach((chunk: any) => {
        if (chunk.web?.uri) links.push(chunk.web.uri);
        if (chunk.maps?.uri) links.push(chunk.maps.uri);
    });

    return { text, links };

  } catch (e) {
    console.error("Chat Error:", e);
    return { text: "Sorry, I encountered an error." };
  }
};

// --- AUDIO: Transcribe ---
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  if (!apiKey) return "";
  const ai = getAI();
  
  // Convert Blob to Base64
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      const base64data = (reader.result as string).split(',')[1];
      try {
        const response = await ai.models.generateContent({
           model: "gemini-2.5-flash",
           contents: {
             parts: [
               { inlineData: { mimeType: "audio/wav", data: base64data } }, // assuming wav/mp3 from recorder
               { text: "Transcribe this audio exactly." }
             ]
           }
        });
        resolve(response.text || "");
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsDataURL(audioBlob);
  });
};

// --- VISION: Analyze Image ---
export const analyzeImage = async (file: File): Promise<string> => {
    if (!apiKey) return "";
    const ai = getAI();

    const reader = new FileReader();
    return new Promise((resolve) => {
        reader.onloadend = async () => {
            const base64 = (reader.result as string).split(',')[1];
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-3-pro-preview",
                    contents: {
                        parts: [
                            { inlineData: { mimeType: file.type, data: base64 } },
                            { text: "Analyze this image. Does it fit the Macdonald Hotels brand (Luxury, Scottish Heritage, Relaxing)? Give a score out of 10." }
                        ]
                    }
                });
                resolve(response.text || "");
            } catch (e) {
                resolve("Error analyzing image.");
            }
        }
        reader.readAsDataURL(file);
    });
}


const mockAssets = (): AssetVersion[] => {
  return Array.from({ length: 20 }).map((_, i) => ({
      id: `mock-v${i+1}`,
      title: `Mock Concept V${i+1}`,
      description: "Fallback data due to missing API key.",
      imageUrl: `https://picsum.photos/800/600?random=${i}`,
      format: 'image',
      stats: { predictedCtr: '0%', impressions: '0' }
  }));
}