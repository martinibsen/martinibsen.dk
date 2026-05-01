import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    subtitle: z.string(),
    readTime: z.string(),
  }),
});

const playbook = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/playbook' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    order: z.number(),
    principle: z.string(),
    estimatedReadTime: z.string(),
  }),
});

export const collections = { blog, playbook };
