import { db } from '@/lib/db';

export const fetchCache = 'force-no-store';

export async function HEAD(request: Request) {
  console.time('[trigger-all-local] HEAD');

  console.time('db.category.findMany');
  const categories = await db.category.findMany({
    where: {
      id: {
        gt: 22
      }
    },
    select: {
      name: true
    }
  });

  console.timeEnd('db.category.findMany');
  console.log('🚀 ~ file: route.ts:15 ~ HEAD ~ categories:', categories);

  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://msnewsapi.vercel.app' : 'http://localhost:3000';
  const triggerOrigin = process.env.NODE_ENV === 'production' ? 'trigger=prod' : 'trigger=local';

  let endpoints = categories.map((category) => `${baseUrl}/api/scrape/googlenews/${category.name}&${triggerOrigin}`);
  console.log('🚀 ~ file: route.ts:20 ~ endpoints ~ endpoints:', endpoints);

  endpoints.map((e) => fetch(e, { method: 'POST' }));

  console.timeEnd('[trigger-all] HEAD');
  return new Response(JSON.stringify('done'), { status: 200 });
}
