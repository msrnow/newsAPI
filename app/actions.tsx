'use server';

import { db } from '@/lib/db';

export async function increment(slug: string, type: string) {
  slug = decodeURIComponent(slug);

  return await db.article.update({
    where: {
      ...(slug.length < 5 ? { short_slug: slug } : { slug: slug })
    },
    data: {
      ...(type === 'view' ? { views: { increment: 1 } } : { likes: { increment: 1 } })
    },
    select: { likes: true, shares: true, views: true }
  });
}
