interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: OpenAIMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenAIClient {
  private apiKey: string;
  private baseUrl: string = "https://api.openai.com/v1";

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || "";
    if (!this.apiKey) {
      console.warn("OpenAI API key not found in environment variables");
    }
  }

  async chatCompletion(
    messages: OpenAIMessage[],
    model: string = "gpt-4",
    options: {
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
      frequency_penalty?: number;
      presence_penalty?: number;
    } = {}
  ): Promise<OpenAIResponse> {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          ...options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenAI API error: ${response.status} - ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("OpenAI API error:", error);
      throw new Error(`Failed to fetch response from OpenAI: ${error.message}`);
    }
  }

  // Helper method for simple text completion
  async generateText(
    prompt: string,
    model: string = "gpt-4",
    options: {
      temperature?: number;
      max_tokens?: number;
      systemMessage?: string;
    } = {}
  ): Promise<string> {
    const messages: OpenAIMessage[] = [];

    if (options.systemMessage) {
      messages.push({
        role: "system",
        content: options.systemMessage,
      });
    }

    messages.push({
      role: "user",
      content: prompt,
    });

    const response = await this.chatCompletion(messages, model, options);
    return response.choices[0]?.message?.content || "";
  }

  // Helper method for generating lyrics
  async generateLyrics(
    theme: string,
    genre: string,
    style: string = "modern",
    options: {
      temperature?: number;
      max_tokens?: number;
    } = {}
  ): Promise<string> {
    const systemMessage = `You are a professional songwriter specializing in ${genre} music. Create engaging, rhythmic lyrics that fit the genre's style and conventions. Focus on emotional connection and memorable hooks.`;

    const prompt = `Write original song lyrics about: ${theme}

Genre: ${genre}
Style: ${style}
Requirements:
- Include verses, chorus, and bridge
- Make it suitable for singing
- Keep it between 200-400 words
- Use appropriate rhyme schemes for the genre
- Include emotional depth and storytelling`;

    return this.generateText(prompt, "gpt-4", {
      systemMessage,
      temperature: options.temperature || 0.8,
      max_tokens: options.max_tokens || 1000,
    });
  }

  // Helper method for generating song descriptions/tags
  async generateSongTags(
    genre: string,
    mood: string,
    instruments: string[],
    style: string = "modern"
  ): Promise<string> {
    const systemMessage = `You are a music producer and tagging expert. Create detailed, descriptive tags for music generation that capture the essence of the desired sound.`;

    const prompt = `Generate comprehensive music generation tags for:
Genre: ${genre}
Mood: ${mood}
Instruments: ${instruments.join(", ")}
Style: ${style}

Create tags that would be used for AI music generation, including:
- Genre-specific elements
- Production techniques
- Emotional qualities
- Technical specifications
- Atmospheric descriptions

Format as comma-separated tags.`;

    return this.generateText(prompt, "gpt-3.5-turbo", {
      systemMessage,
      temperature: 0.7,
      max_tokens: 300,
    });
  }
}

export const openaiClient = new OpenAIClient();
export type { OpenAIMessage, OpenAIResponse };
