import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully, but for this context, an error is fine.
  console.warn("API_KEY environment variable not set. Summary generation will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

interface FileInput {
  data: string; // base64 encoded
  mimeType: string;
}

interface SummaryParams {
  notes: string;
  audio?: FileInput;
}


export const generateSummary = async ({ notes, audio }: SummaryParams): Promise<string> => {
  if (!API_KEY) {
      return "Error: API Key is not configured. Please set the API_KEY environment variable.";
  }
  
  const hasNotes = notes.trim().length > 0;
  if (!hasNotes && !audio) {
    return "";
  }
  
  const prompt = `
    Act as a professional meeting assistant. Your task is to generate a concise, clear, and professional summary of the provided meeting content. The content may include text notes, document excerpts, and/or an audio recording. Analyze all sources to create a comprehensive and accurate summary.

    Please structure the summary using the following Markdown format:

    **Start with a brief, one-sentence overview that captures the main purpose or outcome of the meeting.**

    ### Key Points
    - A bulleted list of the most significant topics, discussions, and highlights.

    ### Decisions Made
    - A bulleted list of all firm decisions that were reached during the meeting.

    ### Action Items
    - A bullet-point list of all tasks that need to be completed.
    - For each action item, clearly state the task and, if a person is mentioned as responsible, format it as: "[Task description] - @[Person's Name]".
    - If no one is explicitly assigned, list the task on its own.

    Use business-appropriate language and maintain a neutral, objective tone throughout.

    ${hasNotes ? `The following text notes provide the primary context for the summary:\n---\n${notes}\n---` : ''}
  `;

  const parts: any[] = [];
  
  if (audio) {
    parts.push({
      inlineData: {
        data: audio.data,
        mimeType: audio.mimeType,
      },
    });
  }
  parts.push({ text: prompt });


  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary:", error);
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('400')) {
        return "Error: The provided file format may not be supported or the file is too large. Please try a different file.";
    }
    return "Error: Could not generate summary. Please check the console for more details.";
  }
};