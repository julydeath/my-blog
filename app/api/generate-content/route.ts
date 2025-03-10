// app/api/generate-content/route.ts
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { query, format } = await request.json();
  
  try {
    const systemPrompt = format === 'blog' 
      ? `You are a professional blog writer. Create a well-structured blog post about the topic provided. 
         Include:
         - A compelling introduction
         - Multiple heading sections (using h2 and h3 HTML tags)
         - Bullet points or numbered lists where appropriate
         - Paragraphs with rich information
         - A conclusion section
         
         Format the content with HTML tags such as <h2>, <h3>, <p>, <ul>, <li>, <ol>, <blockquote>, etc. 
         Keep paragraphs concise and scannable. Use proper formatting consistent with modern blog posts.`
      : "You are a helpful blog post writer. Create content about the provided topic.";
      
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.7,
    });
    
    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}