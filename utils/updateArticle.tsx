import { db } from '@/lib/db';
// import { newArticlesType } from '@/types';

type updatedArticleType = {
  article_source_url: string;
  keywords: string | null | undefined;
  description: string | null | undefined;
  content: string | null | undefined;
};
// | { article_source_url: string };

export default async function UpdateArticle(data: updatedArticleType, slug: string): Promise<Boolean> {
  console.log('data: ', data);
  try {
    const updatedArticleRes = await db.article.update({
      where: {
        slug: slug
      },
      data: data
    });
    console.log('[updatedArticle()] updatedArticleRes.content?.length: ', updatedArticleRes.content?.length);
    return true;
  } catch (error: any) {
    console.log('FAILED updating article, prisma error code: ', error.code, '\n', 'full error', error);
    return false;
  }
}
