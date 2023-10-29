import { localMainCategories  } from '@/data/static/local-main-categories-names';

export const fetchCache = 'force-no-store';

export async function HEAD(request: Request) {
  console.time('[/api/scrape/triggers/main-local-news-categories] HEAD Perf:');
  const categories = localMainCategories;
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://newsapi-msrnow.vercel.app' : 'http://localhost:3000';
  const triggerOrigin = process.env.NODE_ENV === 'production' ? 'trigger=prod' : 'trigger=local';

  let endpoints = categories.map(
    (category: { name: any }) => `${baseUrl}/api/scrape/googlenews/${category.name}&${triggerOrigin}`
  );
  console.log('[/api/scrape/triggers/main-local-news-categories] endpoints:', endpoints);
  endpoints.map((e: RequestInfo | URL) => fetch(e, { method: 'POST' }));
  console.timeEnd('[/api/scrape/triggers/main-local-news-categories] HEAD Perf:');
  return new Response(JSON.stringify('done'), { status: 200 });
}
