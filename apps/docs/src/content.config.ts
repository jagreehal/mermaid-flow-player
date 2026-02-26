import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

function generateDocId({
  entry,
}: {
  entry: string;
  base: URL;
  data: Record<string, unknown>;
}): string {
  const withoutExt = entry.replace(/\.[^.]+$/, '');
  const normalized = withoutExt.replace(/\\/g, '/');
  return normalized.replace(/\/index$/, '') || 'index';
}

export const collections = {
  docs: defineCollection({
    loader: docsLoader({ generateId: generateDocId }),
    schema: docsSchema(),
  }),
};
