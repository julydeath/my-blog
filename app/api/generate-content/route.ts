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
         - Include styling for font changes and better spacing just how a blog will look like
         - Make it best user readble

         For code examples:
         - Include plenty of code snippets that are relevant to the topic
         - Wrap code in proper <pre><code class="language-xxx">...</code></pre> tags
         - Provide comments in the code to explain important parts
         - Make sure the code is correctly indented and formatted
         
         Blog Structure:
         1. Start with a compelling introduction
         2. Use multiple sections with clear headings
         3. Include practical code examples in each relevant section
         4. Add explanations for each code snippet
         5. End with a conclusion or summary

         FORMAT THE CONTENT USING HTML TAGS as follows:
         - Use <h1>, <h2>, <h3> tags for headings (not markdown # style)
         - Use <p> tags for paragraphs
         - Use <ul> and <li> tags for bullet points
         - Use <ol> and <li> tags for numbered lists
         - Use <blockquote> tags for quotes
         - Use <pre><code class="language-xxx">...</code></pre> for code blocks (replace xxx with the language like javascript, typescript, python, etc.)
         `
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