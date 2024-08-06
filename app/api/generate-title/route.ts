import { NextResponse } from 'next/server';
import { vertexAI, model } from '@/app/utils/vertexai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const generativeModel = vertexAI.getGenerativeModel({ model: model });
    
    // Modify the prompt to explicitly ask for a single, concise title
    const titlePrompt = `Generate a single, concise title (maximum 5 words) for a conversation starting with: "${prompt}". Respond with only the title, nothing else.`;
    
    const result = await generativeModel.generateContent(titlePrompt);
    const response = await result.response;

    if (response.candidates && response.candidates.length > 0 &&
        response.candidates[0].content &&
        response.candidates[0].content.parts &&
        response.candidates[0].content.parts.length > 0) {
      const generatedTitle = response.candidates[0].content.parts[0].text;

      if (generatedTitle) {
        // Remove any quotation marks and trim the title
        const cleanedTitle = generatedTitle.replace(/["']/g, '').trim();
        return NextResponse.json({ title: cleanedTitle });
      }
    }

    return NextResponse.json({ error: 'Failed to generate title' }, { status: 500 });
  } catch (error) {
    console.error('Error generating title:', error);
    return NextResponse.json({ error: 'Failed to generate title' }, { status: 500 });
  }
}