import { GoogleGenAI, Type } from "@google/genai";
import { StartupIdea } from "../types";

export async function generateStartupIdeas(interest: string, apiKey: string): Promise<StartupIdea[]> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Act as a startup strategist and product analyst. 
  The user is interested in: "${interest}".
  
  Generate exactly 5 startup ideas based on this interest.
  
  Rules:
  - Avoid generic ideas like "AI chatbot" or "social media app"
  - Focus on realistic, buildable ideas for a solo developer
  - Ideas should be high-conviction and niche
  - For each idea include:
    1. A catchy title
    2. Problem it solves
    3. Target users
    4. Simple MVP (how to build it in 1 week)
    5. Monetization strategy
    6. Why it can scale
    7. Basic validation score (1–10)
  
  Return the response as a JSON array of objects.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              problem: { type: Type.STRING },
              targetUsers: { type: Type.STRING },
              mvp: { type: Type.STRING },
              monetization: { type: Type.STRING },
              scalability: { type: Type.STRING },
              validationScore: { type: Type.NUMBER },
            },
            required: ["title", "problem", "targetUsers", "mvp", "monetization", "scalability", "validationScore"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const ideas = JSON.parse(text) as StartupIdea[];
    // Ensure IDs exist
    return ideas.map((idea, index) => ({
      ...idea,
      id: idea.id || `idea-${index}-${Date.now()}`
    }));
  } catch (error) {
    console.error("Error generating ideas:", error);
    throw error;
  }
}
