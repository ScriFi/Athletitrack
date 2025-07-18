import { GoogleGenAI } from '@google/genai';
import { Building, Season } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function suggestDescription(title: string, building: Building, team: string, season: Season): Promise<string> {
    if (!process.env.API_KEY) {
        return "AI suggestions are currently unavailable. Please check the API key configuration.";
    }

    const prompt = `You are an assistant for a school's sports facility scheduler.
    Your task is to generate a concise and engaging event description.
    The event is titled "${title}" for the "${team}" team.
    It will take place in the "${building.name}" during the ${season} season.
    Keep the description under 25 words. Make it sound exciting and informative for students and faculty.
    
    Example:
    Event: "Varsity Basketball Practice", Team: "Men's Varsity", Building: "Main Gymnasium", Season: "Fall"
    Description: "The Men's Varsity team hits the court for intense drills. Get ready for the Fall season tip-off!"
    
    Now, generate a description for the given event.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 60,
                thinkingConfig: { thinkingBudget: 0 } 
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Could not generate a suggestion at this time.";
    }
}
