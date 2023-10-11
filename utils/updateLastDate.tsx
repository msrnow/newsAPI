import { db } from '@/lib/db';

type currentCategory = {
  id: number;
  name: string;
  google_news_url: string;
  source: { id: number; name: string; url: null; scrapable: number; content_selector: string | null }[];
};

type Category = {
  id: number;
  name: string;
  google_news_url: string;
};

export default async function updateLastDate({
  newLastDate,
  currentCategory
}: {
  newLastDate: Date;
  currentCategory: currentCategory | Category;
}) {
  const res = await db.category.update({
    where: { id: currentCategory.id },
    data: { last_date: new Date(newLastDate).toISOString() }
  });

  if (res.last_date) {
    return res;
  }

  return false;
}
