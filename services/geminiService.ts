import { Building, Team } from '../types';

export async function suggestDescription(title: string, building: Building, team: Team, organizationName: string): Promise<string> {
    
    // The API call is now sent to our own serverless function endpoint
    const endpoint = '/.netlify/functions/gemini';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                building,
                team,
                organizationName
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch suggestion');
        }

        const data = await response.json();
        return data.suggestion;

    } catch (error) {
        console.error("Error calling suggestion function:", error);
        if (error instanceof Error) {
            return `Could not generate a suggestion: ${error.message}`;
        }
        return "Could not generate a suggestion at this time.";
    }
}