// schema.ts
import { pgTable, text, varchar, timestamp, serial, integer, uniqueIndex } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 256 }).unique().notNull(),
  content: text('content').notNull(), // MDX content
  excerpt: varchar('excerpt', { length: 512 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
