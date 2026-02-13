
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ImageSize } from "../types";

// Helper to get fresh instance
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates 5 distinct scene descriptions for coloring pages based on a theme.
 */
export async function generatePagePrompts(theme: string): Promise<string[]> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 specific scene descriptions for a children's coloring book based on the theme: "${theme}". 
    Each scene should be simple and clear. Return as a JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse prompts", e);
    return Array(5).fill(`A simple coloring page about ${theme}`);
  }
}

/**
 * Generates a single black-and-white coloring page image.
 */
export async function generateColoringImage(prompt: string, size: ImageSize): Promise<string> {
  const ai = getAI();
  // We prepend strict instructions for coloring book style
  const fullPrompt = `Line art coloring book page for children, ${prompt}. Thick black outlines, solid white background, no shading, minimal detail, high contrast, clean lines.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: fullPrompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image data returned from model");
}

/**
 * Chat bot service using gemini-3-pro-preview
 */
export async function* streamChat(history: {role: string, parts: {text: string}[]}[], message: string) {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: 'You are a friendly, imaginative assistant for a children\'s coloring book app. You help kids and parents come up with creative ideas for coloring pages and tell short, magical stories about their creations. Keep it positive, safe, and fun.',
    }
  });

  const response = await chat.sendMessageStream({ message });
  for await (const chunk of response) {
    const c = chunk as GenerateContentResponse;
    yield c.text;
  }
}
