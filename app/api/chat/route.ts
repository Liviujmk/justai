import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';
// import { createOllama } from 'ollama-ai-provider';

// const ollama = createOllama({
//   // optional settings, e.g.

//   baseURL: 'https://api.ollama.com',
// });
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4.1-nano'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
