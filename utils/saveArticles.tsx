import { db } from '@/lib/db';
import { newArticlesType } from '@/types';
import addShortSlugs from '@/utils/addShortSlugs';

export default async function SaveArticles(newArticles: newArticlesType): Promise<Boolean> {
  // console.log('newArticles: ', newArticles);
  let sluggedArticles = newArticles;
  let failureTries = 0;
  let maxTries = 4;

  while (true) {
    try {
      const savedArticles = await db.article.createMany({
        data: sluggedArticles,
        skipDuplicates: true
      });
      console.log('savedArticles: ', savedArticles);
      return true;
    } catch (error: any) {
      if (error.code === 'P2002') {
        // this can not happen because I used skipDuplicates: true already!
        if (failureTries < maxTries) {
          console.log('P2002 error: found duplicate slugs, trying new slugs...', '\n', ' full error: ', error);
          failureTries++;
          sluggedArticles = addShortSlugs(newArticles); // Update with new short_slug(s) and try again
        } else {
          // Maximum retries reached, don't update last_date unless this succeeds
          console.log('Maximum retry attempts reached.');
          return false;
        }
      } else {
        console.log('FAILED saving newArticle(s), prisma error code: ', error.code, '\n', 'full error', error);
        return false;
      }
    }
  }
}
