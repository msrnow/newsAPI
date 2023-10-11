import { newArticlesType } from '@/types';
import generateShortSlugs from '@/utils/generateShortSlugs';

export default function addShortSlugs(articles: newArticlesType) {
  return articles.map((article) => ({
    ...article,
    short_slug: generateShortSlugs(1)[0]
  }));
}
