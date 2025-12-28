import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    try {
        const { image } = await req.json(); // base64 image
        if (!image) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
      Analyze this image of a bank statement, spending chart, or transaction list.
      Extract all individual transactions or category summaries into a structured JSON format.
      Return a JSON array of objects with these fields:
      - date (string, YYYY-MM-DD format if available, otherwise current year)
      - description (string, merchant or category name)
      - amount (number, negative for expense, positive for income)
      - category (string, e.g., Food, Transport, Shopping)

      If it's a summary chart, create a single entry for each category shown with an estimated date.
      Only return the JSON array, nothing else.
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: image.split(',')[1],
                    mimeType: 'image/jpeg',
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean the text to ensure it's valid JSON
        const jsonStr = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Image analysis error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
