import { secondaryCategories  } from '@/data/static/secondary-categories-names';

export const fetchCache = 'force-no-store';

export async function HEAD(request: Request) {
  console.time('[/api/scrape/trigger/secondary-news-categories] HEAD');
  const categories = secondaryCategories;
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://newsapi-msrnow.vercel.app' : 'http://localhost:3000';
  const triggerOrigin = process.env.NODE_ENV === 'production' ? 'trigger=prod' : 'trigger=local';

  let endpoints = categories.map(
    (category: { name: any }) => `${baseUrl}/api/scrape/googlenews/${category.name}&${triggerOrigin}`
  );
  console.log('🚀 ~ file: route.ts:20 ~ endpoints ~ endpoints:', endpoints);
  endpoints.map((e: RequestInfo | URL) => fetch(e, { method: 'POST' }));
  console.timeEnd('[/api/scrape/trigger/secondary-news-categories] HEAD');
  return new Response(JSON.stringify('done'), { status: 200 });
}
