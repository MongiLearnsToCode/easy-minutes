import OpenAI from "openai";

const API_KEY = process.env.OPENAI_API_KEY;

let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!API_KEY) {
    console.warn("OPENAI_API_KEY environment variable not set. Summary generation will not work.");
    return null;
  }

  if (!openai) {
    openai = new OpenAI({
      apiKey: API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  return openai;
}

interface FileInput {
  data: string;
  mimeType: string;
}

interface SummaryParams {
  notes: string;
  audio?: FileInput;
}

export const generateSummary = async ({ notes, audio }: SummaryParams): Promise<string> => {
  const client = getOpenAIClient();

  if (!client) {
      return "Error: API Key is not configured. Please set the OPENAI_API_KEY environment variable.";
  }

  const hasNotes = notes.trim().length > 0;
  if (!hasNotes && !audio) {
    return "";
  }

  const systemPrompt = `Act as a professional meeting assistant. Your task is to generate a concise, clear, and professional summary of the provided meeting content. The content may include text notes, document excerpts, and/or an audio recording. Analyze all sources to create a comprehensive and accurate summary.

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

Use business-appropriate language and maintain a neutral, objective tone throughout.`;

  try {
    if (audio) {
      const audioBuffer = Uint8Array.from(atob(audio.data), c => c.charCodeAt(0));
      const audioBlob = new Blob([audioBuffer], { type: audio.mimeType });
      const audioFile = new File([audioBlob], "audio.wav", { type: audio.mimeType });

      const transcription = await client.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
      });

      const combinedText = hasNotes
        ? `${notes}\n\nAudio Transcription:\n${transcription.text}`
        : transcription.text;

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: combinedText }
        ],
      });

      return completion.choices[0]?.message?.content || "Error: No response generated.";
    } else {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: notes }
        ],
      });

      return completion.choices[0]?.message?.content || "Error: No response generated.";
    }
  } catch (error) {
    console.error("Error generating summary:", error);
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('400') || errorMessage.includes('invalid_request_error')) {
        return "Error: The provided file format may not be supported or the file is too large. Please try a different file.";
    }
    return "Error: Could not generate summary. Please check the console for more details.";
  }
};
