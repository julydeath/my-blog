// app/api/posts/route.ts
import { db } from '@/db';
import { posts } from '@/db/schema';
import { createSlug } from '@/utils/slugify';

export async function POST(request: Request) {
  const { title, content, tags: postTags } = await request.json();
  
  // Create post
  const [post] = await db.insert(posts).values({
    title,
    content,
    slug: createSlug(title),
  }).returning();

}