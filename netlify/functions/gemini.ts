import { GoogleGenAI } from '@google/genai';
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Define input types based on what the frontend sends
interface Building {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

interface RequestBody {
    title: string;
    building: Building;
    team: Team;
    organizationName: string;
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }
    
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API key is not configured on the server.' }),
        };
    }
    
    try {
        const { title, building, team, organizationName } = JSON.parse(event.body || '{}') as RequestBody;

        if (!title || !building || !team || !organizationName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields in request body.' }),
            };
        }

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are an assistant for the facility scheduler at "${organizationName}".
Your task is to generate a concise and engaging event description.
The event is for the "${team.name}" team, is titled "${title}", and will take place in the "${building.name}".
Keep the description under 25 words. Make it sound exciting and informative for students and faculty.

Example:
Organization: "Northwood High", Team: "Varsity Basketball", Event: "Practice", Building: "Main Gymnasium"
Description: "Join the Northwood varsity team for intense drills and scrimmage practice. Get ready for the next big game!"

Now, generate a description for the given event.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 60,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ suggestion: response.text.trim() }),
        };

    } catch (error) {
        console.error("Error in Gemini function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred while generating the suggestion." }),
        };
    }
};

export { handler };
