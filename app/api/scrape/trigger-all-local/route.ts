// import { db } from '@/lib/db';
import { localCategories } from '@/data/static/local-categories-names';

export const fetchCache = 'force-no-store';

export async function HEAD(request: Request) {
  console.time('[trigger-all-local] HEAD Perf:');

  const categories = localCategories;
  // const categories = await db.category.findMany({
  //   where: {
  //     id: {
  //       gt: 22
  //     }
  //   },
  //   select: {
  //     name: true
  //   }
  // });

  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://newsapi-msrnow.vercel.app' : 'http://localhost:3000';
  const triggerOrigin = process.env.NODE_ENV === 'production' ? 'trigger=prod' : 'trigger=local';

  let endpoints = categories.map(
    (category: { name: any }) => `${baseUrl}/api/scrape/googlenews/${category.name}&${triggerOrigin}`
  );
  console.log('[trigger-all-local] endpoints:', endpoints);

  endpoints.map((e: RequestInfo | URL) => fetch(e, { method: 'POST' }));

  console.timeEnd('[trigger-all-local] HEAD Perf:');
  return new Response(JSON.stringify('done'), { status: 200 });
}
