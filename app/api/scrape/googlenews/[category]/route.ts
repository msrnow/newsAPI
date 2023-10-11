import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { db } from '@/lib/db';
import { sanitizeTitle } from '@/utils/sanitizeTitle';
import { sanitizeSlug } from '@/utils/sanitizeSlug';
// import { categoriesAndSources } from '@/data/static/staticCategoriesAndSources';
import generateShortSlugs from '@/utils/generateShortSlugs';
import SaveArticles from '@/utils/saveArticles';
import updateLastDate from '@/utils/updateLastDate';
import { headers } from 'next/headers';

// export const runtime = 'nodejs';
// export const dynamic = 'auto';
// export const fetchCache = 'force-no-store';

// console.dir(request, { depth: null });

export async function POST(request: NextRequest, params: { params: { category: string } }) {
  const headersList = headers();
  const host = headersList.get('host');
  console.log('🚀 host:', host);

  const param = params.params.category;
  console.log('🚀 ~ file: route.ts:17 ~ POST ~ param:', param);
  console.log("param.indexOf('&'): ", param.indexOf('&'));
  const category = param.substring(0, param.indexOf('&') !== -1 ? param.indexOf('&') : param.length);
  console.log('🚀 ~ file: route.ts:19 ~ POST ~ category:', category);
  console.time(`[${category}] [Time] POST Route`);

  console.time(`[${category}] db.category.findMany`);
  const categories = await db.category.findMany();

  console.timeEnd(`[${category}] db.category.findMany`);
  console.log('🚀 ~ file: route.ts:31 ~ POST ~ categories[0]:', categories[0], ' - ', categories.length);

  // const currentCategory = categoriesAndSources.find((c) => c.name === category);
  const currentCategory = categories.find((c) => c.name === category);
  if (!currentCategory) {
    return new NextResponse(`[${category}] UnSupported Category. If new, add it`, { status: 415 });
  }

  const last_date = await db.category
    .findUnique({ where: { id: currentCategory.id }, select: { last_date: true } })
    .then((l: any) => l?.last_date);

  const page = await fetch(currentCategory.google_news_url).then((res) => res.text());
  const $ = cheerio.load(page, { xmlMode: true });

  // const sources = currentCategory.source;
  const sources = await db.source.findMany();
  const scrapedFromSource = 'https://news.google.com/';
  let newLastDate = last_date ? new Date(last_date) : null;
  console.log(`[${currentCategory.name}] [Before] last_date: `, last_date);

  let coverage_url = '';
  let coverage_url_arr: string[] = [];
  const articles = await Promise.all(
    $('article.IBr9hb, article.IFHyqb.DeXSAc')
      .filter((_, article) => {
        const hasImage = $(article).find('img.Quavad').length > 0;
        // accept all, and uncomment this when you start blocking some sources.
        // TODO: to accept all, you need to implement the dynamic adding of new sources in this filter block, just like you did in utils/scrapeRelatedNews
        const isSupportedSource = sources.some((s) => s.name === $(article).find('.vr1PYe').text().trim());
        const articleDatetime = $(article).find('time.hvbAAd').attr('datetime');
        if (articleDatetime && last_date) {
          const isRecent = new Date(articleDatetime) > new Date(last_date);
          const isNewLastDate = newLastDate ? new Date(articleDatetime) > newLastDate : false;
          if (isNewLastDate) {
            newLastDate = new Date(articleDatetime);
          }
          if (hasImage && isSupportedSource && isRecent && article.next) {
            coverage_url = $(article.next).children('.Ylktk').children('.jKHa4e').attr('href')?.toString() || '';
            coverage_url_arr.push(coverage_url);
          }
          return hasImage && isSupportedSource && isRecent;
        }
        return false;
      })
      .map(async (i, article) => {
        const articleObj = {
          scraped_from: scrapedFromSource,
          title: sanitizeTitle($(article).find('h4').text().trim()),
          google_thumb: $(article).find('img.Quavad').attr('src'),
          article_google_url: `${scrapedFromSource}${$(article).find('a').attr('href')}`,
          related_coverage_url: coverage_url_arr[i] ? `${scrapedFromSource}${coverage_url_arr[i]}` : '',
          slug: sanitizeSlug($(article).find('h4').text().trim()),
          published_at: $(article).find('time.hvbAAd').attr('datetime'),
          sourceId: sources.filter((s) => s.name === $(article).find('.vr1PYe').text().trim())[0].id,
          categoryId: currentCategory.id,
          short_slug: generateShortSlugs(1)[0]
        };
        return articleObj;
      })
      .get()
  );

  console.log(`[${currentCategory.name}] [After] newLastDate: `, newLastDate);
  console.log(`[${currentCategory.name}] coverage_url_arr: `, coverage_url_arr, ' - ', coverage_url_arr.length);

  let isSavedToDB = false;
  let isUpdatedLastdate = false;

  // check that there are new articles, and newLastDate has the updated last_date
  if (newLastDate && last_date && newLastDate > new Date(last_date) && articles.length > 0) {
    // save new articles to db
    console.log(`[${currentCategory.name}] Adding new article to DB...`);
    const isSaved = await SaveArticles(articles);
    if (isSaved) {
      // on success, update last_date
      console.log(`[${currentCategory.name}] Updating last_date to DB...`);
      isSavedToDB = true;
      const res = await updateLastDate({ newLastDate, currentCategory });
      if (res && res.last_date) {
        console.log(`[${currentCategory.name}] Updated last_date on db, res: `, res.last_date);
        isUpdatedLastdate = true;
      }
    }
  }

  console.timeEnd(`[${category}] [Time] POST Route`);
  return NextResponse.json({
    status: 200,
    last_date: last_date,
    articles: articles.length,
    isSavedToDB: isSavedToDB,
    newLastDate: newLastDate,
    isUpdatedLastdate: isUpdatedLastdate,
    currentCategory: currentCategory.name
  });
}
