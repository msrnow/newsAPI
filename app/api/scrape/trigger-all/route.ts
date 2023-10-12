import { db } from '@/lib/db';

export const fetchCache = 'force-no-store';

export async function HEAD(request: Request) {
  console.time('[trigger-all] HEAD');

  console.time('db.category.findMany');
  const categories = await db.category.findMany({
    where: {
      NOT: {
        name: 'top-headline'
      },
      AND: {
        id: {
          lt: 22
        }
      }
    },
    select: {
      name: true
    }
  });

  console.timeEnd('db.category.findMany');
  console.log('🚀 ~ file: route.ts:15 ~ HEAD ~ categories:', categories);

  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://newsapi-msrnow.vercel.app' : 'http://localhost:3000';
  const triggerOrigin = process.env.NODE_ENV === 'production' ? 'trigger=prod' : 'trigger=local';

  let endpoints = categories.map((category: { name: any; }) => `${baseUrl}/api/scrape/googlenews/${category.name}&${triggerOrigin}`);
  console.log('🚀 ~ file: route.ts:20 ~ endpoints ~ endpoints:', endpoints);

  // fetch(`${baseUrl}/api/scrape/googlenewstopheadlines?${triggerOrigin}`, { method: 'POST' });

  endpoints.map((e: RequestInfo | URL) => fetch(e, { method: 'POST' }));

  console.timeEnd('[trigger-all] HEAD');
  return new Response(JSON.stringify('done'), { status: 200 });
}
