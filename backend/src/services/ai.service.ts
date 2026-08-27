import OpenAI from "openai";

// Groq use karana widihata base URL eka maru karamu (Free & fast)
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, // .env eke GROQ_API_KEY kiyala danna
  baseURL: "https://api.groq.com/openai/v1",
});

export interface GeneratedContent {
  title: string;
  script: string;
  description: string;
  hashtags: string[];
}

export async function generateVideoContent(
  topic: string,
  niche: string,
  duration: number
): Promise<GeneratedContent> {
  const prompt = `
Create content for a YouTube Short.

Niche: ${niche}
Topic: ${topic}
Duration: approximately ${duration} seconds.

Return ONLY valid JSON in this exact structure:

{
  "title": "YouTube Shorts title",
  "script": "Voice-over script",
  "description": "SEO optimized YouTube description",
  "hashtags": ["#shorts", "#football"]
}

Requirements:

- Make the title catchy and natural.
- Script must fit approximately ${duration} seconds.
- Use simple spoken English.
- Description should be SEO friendly.
- Generate 5 to 10 relevant hashtags.
- Do not use markdown.
- Do not include anything outside the JSON.
`;

const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-20b", // Me model eka use karanna
    messages: [
      {
        role: "system",
        content:
          "You are an expert YouTube Shorts content creator and SEO specialist. Always respond with raw JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.8,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("AI returned empty response");
  }

  return JSON.parse(content) as GeneratedContent;
}