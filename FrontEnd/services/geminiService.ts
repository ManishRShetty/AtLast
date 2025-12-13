import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// IMPORTANT: The API Key comes from process.env.API_KEY as per standard secure practices.
// The app assumes this is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateRiddle = async (location: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API KEY MISSING: Cannot generate riddle from mainframe.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a short, cryptic, 4-line cyberpunk/noir style riddle describing the city of ${location}. Do not mention the city name explicitly. Focus on landmarks, atmosphere, or history.`,
    });
    return response.text || "Data corrupted. No riddle found.";
  } catch (error) {
    console.error("Gemini Riddle Error:", error);
    return "Signal jammed. Unable to retrieve target profile.";
  }
};

export const streamAgentDebate = async (location: string, onChunk: (text: string) => void) => {
  if (!process.env.API_KEY) {
    onChunk("SYSTEM: API KEY MISSING. OFFLINE MODE.");
    return;
  }

  try {
    const prompt = `
      Simulate a real-time chat log between two cyberpunk hackers, 'Ghost' and 'Wraith', trying to locate a target in ${location}.
      - They should NOT say the city name directly yet.
      - They should trade technical jargon and cryptic clues about the city.
      - Output format MUST be strictly: "AgentName: Message" per line.
      - Keep it intense and fast.
      - Generate about 5-6 exchanges.
    `;

    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        // Split by newlines in case multiple lines come in one chunk
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        lines.forEach(line => onChunk(line));
      }
    }
  } catch (error) {
    console.error("Gemini Debate Error:", error);
    onChunk("SYSTEM: ENCRYPTED CHANNEL LOST.");
  }
};