
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMedicineSuggestion = async (
  age: string,
  weight: string,
  symptoms: string
) => {
  try {
    const prompt = `
      You are a helpful medical assistant for a Bangladeshi medicine delivery app.
      The user is ${age} years old and weighs ${weight}kg.
      Symptoms: ${symptoms}.
      
      Suggest 2-3 common Over-The-Counter (OTC) medicines available in Bangladesh (e.g., Napa, Ace, Tufnil, etc.) that might help. 
      Include the generic name and typical dosage.
      
      CRITICAL WARNING: Start with a disclaimer that you are an AI and they should consult a doctor.
      Format the output using clear markdown.
      
      IMPORTANT: Provide the response in English first, followed immediately by a Bengali (Bangla) translation.
    `;

    // Updated: gemini-3-pro-preview does not support thinkingConfig. Removed it.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating suggestion:", error);
    return "I apologize, but I couldn't generate a suggestion at this moment. Please consult a doctor.";
  }
};

export const searchMedicinesOrPharmacies = async (query: string, location?: { lat: number, lng: number }) => {
  try {
    const tools: any[] = [];
    const isLocationQuery = query.toLowerCase().includes('near') || query.toLowerCase().includes('pharmacy') || query.toLowerCase().includes('where');
    
    if (isLocationQuery) {
        tools.push({ googleMaps: {} });
    } else {
        tools.push({ googleSearch: {} });
    }

    const config: any = { 
      tools,
      systemInstruction: `You are a helpful medical assistant for a pharmacy app in Bangladesh. 
      If the user asks for a medicine (e.g., an international brand like Tylenol), identify the generic name and suggest the popular Bangladeshi equivalent brand (e.g., Napa for Paracetamol).
      Always provide your response in English first, followed by a clear Bengali (Bangla) translation.`
    };
    
    if (isLocationQuery && location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.lat,
            longitude: location.lng
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: config
    });
    
    return {
      text: response.text,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Error searching:", error);
    throw error;
  }
};

export const generateHealthTips = async (topic: string) => {
  try {
    const prompt = `Provide 3-5 concise, actionable health tips about "${topic}". Focus on the context of Bangladesh if relevant (e.g. weather, food habits, common seasonal issues). Use Google Search to get the latest and most accurate information. Format the response with bold headings. Provide the content in English first, followed by a Bengali (Bangla) translation.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Explicitly force Google Search
        systemInstruction: "You are a health expert providing tips for the general public. Be encouraging and practical. Always include a Bangla translation.",
      }
    });

    return {
      text: response.text,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Error generating health tips:", error);
    throw error;
  }
};

export const editPrescriptionImage = async (base64Image: string, promptText: string) => {
  try {
    // Strip header if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanBase64
            }
          },
          { text: promptText || "Enhance clarity and remove noise" }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};

export const analyzePrescriptionImage = async (base64Image: string) => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: cleanBase64 } },
          { 
            text: `Analyze this prescription image carefully. Identify all the medicines prescribed. 
            Return a JSON array where each object has:
            - name: The brand name of the medicine (e.g., Napa, Sergel).
            - genericName: The generic name (e.g., Paracetamol, Esomeprazole).
            - type: The form of the medicine (e.g., Tablet, Capsule, Syrup, Suspension, Injection, Drop, Cream, Gel, Inhaler).
            - price: An estimated price in Bangladeshi Taka (BDT) for a standard unit (e.g. one strip or bottle). Make a reasonable guess based on Bangladeshi market prices.
            - sideEffects: A brief string listing 2-3 common side effects (e.g., "Drowsiness, Nausea").
            
            Ignore doctor names or other non-medicine text. If the handwriting is unclear, use your knowledge of common medicines in Bangladesh to infer the name.` 
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              genericName: { type: Type.STRING },
              type: { type: Type.STRING },
              price: { type: Type.NUMBER },
              sideEffects: { type: Type.STRING },
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing prescription:", error);
    return [];
  }
};

export const translateMedicineDetails = async (medicine: any) => {
  try {
    const prompt = `
      Translate the following medicine details into Bengali (Bangla) for a Bangladeshi user.
      
      Medicine: ${medicine.name}
      Primary Use: ${medicine.primaryUse}
      Side Effects: ${medicine.sideEffects}
      Storage: ${medicine.storage}
      Description: ${medicine.description || 'Generic description'}

      Return a JSON object with strictly these keys:
      {
        "primaryUseBn": "Translated primary use",
        "sideEffectsBn": "Translated side effects",
        "storageBn": "Translated storage instructions",
        "descriptionBn": "Translated description"
      }
      
      Ensure the Bengali is natural and easy to understand for general public.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { 
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryUseBn: { type: Type.STRING },
            sideEffectsBn: { type: Type.STRING },
            storageBn: { type: Type.STRING },
            descriptionBn: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Translation error", error);
    return null;
  }
};

export const parseMedicineDetails = async (input: string) => {
  try {
    const prompt = `
      You are a professional Data Entry Specialist for a Bangladeshi Pharmacy Database.
      Analyze the following input to extract structured medicine data.
      
      Input: "${input}"
      
      Instructions:
      1. If the input is a URL, use Google Search to find the specific medicine details mentioned on that page or associated with that link.
      2. If the input is raw text, parse it directly.
      3. Focus on finding data relevant to the Bangladesh market (e.g. Price in BDT, local manufacturers like Square, Beximco, Incepta).
      
      Output Format:
      You MUST return ONLY a raw JSON object (no markdown formatting, no code blocks) with the following keys:
      {
        "name": "Brand name",
        "genericName": "Generic name",
        "price": 0, // Number, estimated BDT
        "manufacturer": "Company Name",
        "type": "Tablet/Syrup/etc",
        "category": "Therapeutic category",
        "primaryUse": "Short description",
        "sideEffects": "Common side effects",
        "storage": "Storage info"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType and responseSchema are NOT used when tools are present to ensure tool usage works correctly.
      }
    });

    const text = response.text || '{}';
    // Clean up potential markdown code blocks if the model ignores the instruction
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Data entry analysis failed:", error);
    return null;
  }
};

// Live API Helpers
export const connectLiveSession = async (
  onOpen: () => void,
  onMessage: (message: any) => void,
  onClose: () => void,
  onError: (e: any) => void
) => {
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: {
      onopen: onOpen,
      onmessage: onMessage,
      onclose: onClose,
      onerror: onError,
    },
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
      },
      systemInstruction: "You are a professional and empathetic pharmacist assistant in Bangladesh. You help users understand medicines, dosage, and general health advice. Speak clearly and concisely. You can speak English and Bengali.",
    }
  });
};
