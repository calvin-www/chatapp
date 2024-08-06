import { NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

const vertexAI = new VertexAI({
  project: 'chatapp-e3666',
  location: 'us-central1',
});

const model = 'gemini-1.5-pro';

export async function POST(req: Request) {
  const { message, conversationHistory } = await req.json();

  const encoder = new TextEncoder();

  try {
    const generativeModel = vertexAI.getGenerativeModel({ model: model });

    // Construct the prompt using the conversation history and the new message
    const prompt = `${conversationHistory}\nHuman: ${message}\nAI:`;

    const streamingResponse = await generativeModel.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const item of streamingResponse.stream) {
          if (item.candidates && item.candidates.length > 0 &&
              item.candidates[0].content &&
              item.candidates[0].content.parts &&
              item.candidates[0].content.parts.length > 0) {
            const chunk = item.candidates[0].content.parts[0].text;
            controller.enqueue(encoder.encode(chunk));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('Error calling Vertex AI:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}