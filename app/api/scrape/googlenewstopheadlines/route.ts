import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { db } from '@/lib/db';
import { sanitizeTitle } from '@/utils/sanitizeTitle';
import { sanitizeSlug } from '@/utils/sanitizeSlug';
import generateShortSlugs from '@/utils/generateShortSlugs';
import updateLastDate from '@/utils/updateLastDate';
import { articleType, sourceType } from '@/types';

export const fetchCache = 'force-no-store';

export async function POST() {
  const category = 'top-headline';
  console.time(`[${category}] [Time] GET Route`);

  const currentCategory = await db.category.findUnique({
    where: { name: category },
    select: { id: true, name: true, google_news_url: true, last_date: true }
  });
  if (!currentCategory) {
    return new NextResponse(`[${category}] UnSupported Category. If new, ADD IT PLEASE`, { status: 415 });
  }
  const last_date = currentCategory?.last_date;
  if (!last_date) {
    return new NextResponse(`[${category}] last_date IS EMPTY. If new, ADD IT PLEASE`, { status: 415 });
  }

  const page = await fetch(currentCategory.google_news_url).then((res) => res.text());
  const $ = cheerio.load(page, { xmlMode: true });

  // const sources = currentCategory.source; // re-think and uncomment when you start to filter-out some blocked-sources (add as new field/column)
  const scrapedFromSource = 'https://news.google.com/';
  let newLastDate = new Date(last_date);
  console.log(`[${category}] [Before] last_date: `, last_date);

  let coverage_url = '';
  let coverage_url_arr: string[] = [];
  let currentSources: { name: string }[] = [];
  let updatedSourcesFromDB: sourceType[] = [];

  const updateCurrentSources = (allSources: sourceType[]) => {
    console.log(`[${category}] [updateCurrentSources] allSources.length: `, allSources.length);
    updatedSourcesFromDB = allSources;
    console.log(`[${category}] [updateCurrentSources] updatedSourcesFromDB.length: `, updatedSourcesFromDB.length);
  };

  const getSourceId = (sourceName: string) => {
    const source = updatedSourcesFromDB.filter((s) => s.name === sourceName);
    return source[0]?.id || sourceName;
  };

  const getSourceIdByName = (sourceName: string) => {
    const source = updatedSourcesFromDB.filter((s) => s.name.trim() === sourceName);
    return source[0]?.id;
  };

  const articles = await Promise.all(
    $('article.IBr9hb, article.IFHyqb.DeXSAc')
      .filter((_, article) => {
        const hasImage = $(article).find('img.Quavad').length > 0;
        // Delete/Filter-Out specific sources manually when caught manually, for now, accept all sources,
        // const isSupportedSource = sources.some((s) => s.name === $(article).find('.vr1PYe').text().trim());
        const articleDatetime = $(article).find('time.hvbAAd').attr('datetime');
        if (articleDatetime && last_date) {
          const isRecent = new Date(articleDatetime) > new Date(last_date);
          const isNewLastDate = newLastDate ? new Date(articleDatetime) > newLastDate : false;
          if (isNewLastDate) {
            newLastDate = new Date(articleDatetime);
          }
          if (hasImage && isRecent && article.next) {
            coverage_url = $(article.next).children('.Ylktk').children('.jKHa4e').attr('href')?.toString() || '';
            coverage_url_arr.push(coverage_url);

            const articleSource = $(article).find('.vr1PYe').text().trim();
            currentSources.push({ name: articleSource });
          }
          return hasImage && isRecent;
        }
        return false;
      })
      .map(async (i, article) => {
        let allSources: sourceType[] = [];
        if (i === 0) {
          console.log('[i===0] currentSources[0]: ', currentSources[0], ' - ', currentSources.length);
          const currentSourceRes = await db.source.createMany({
            data: currentSources,
            skipDuplicates: true
          });
          console.log('[i===0] currentSourceRes: ', currentSourceRes);
          // // if there was any new sources that prisma just saved to the db, then fetch all (updated) sources
          // get allSources from db, since I don't have them anyway, whether prisma just added new sources to them or not
          allSources = await db.source.findMany();
          console.log('[i===0] allSources.length: ', allSources.length);
          updateCurrentSources(allSources);
        }

        const articleObj = {
          scraped_from: scrapedFromSource,
          title: sanitizeTitle($(article).find('h4').text().trim()),
          google_thumb: $(article).find('img.Quavad').attr('src'),
          article_google_url: `${scrapedFromSource}${$(article).find('a').attr('href')}`,
          related_coverage_url: coverage_url_arr[i] ? `${scrapedFromSource}${coverage_url_arr[i]}` : '',
          slug: sanitizeSlug($(article).find('h4').text().trim()),
          published_at: $(article).find('time.hvbAAd').attr('datetime'),
          sourceId: getSourceId($(article).find('.vr1PYe').text().trim()),
          categoryId: currentCategory.id,
          short_slug: generateShortSlugs(1)[0],
          top_headline: true
        };
        return articleObj;
      })
      .get()
  );

  console.log(`[${category}] [After] newLastDate: `, newLastDate);
  console.log(`[${category}] coverage_url_arr.length: `, coverage_url_arr.length);

  let currentSlugs: string[] = [];
  const articlesWithSourceid = articles.map((a: articleType, i) => {
    const sourceId = typeof a.sourceId === 'string' ? getSourceIdByName(a.sourceId) : a.sourceId;
    currentSlugs.push(a.slug);
    return { ...a, sourceId: sourceId };
  });

  articlesWithSourceid.map((a) => console.log(`[${category}] a.sourceId: `, a.sourceId)); // check if all have sourceId and not sourceName
  console.log(`[${category}] articlesWithSourceid.length: `, articlesWithSourceid.length);

  // call with prisma, are there any article with any of these slugs or any of these published_at dates?
  console.log(`[${category}] currentSlugs.length: `, currentSlugs.length);
  const areThereDuplicates = await db.article.findMany({
    where: {
      slug: {
        in: currentSlugs
      }
    }
  });
  // if yes, return them to me, then loop over them and update their top_headline field to true // ignore the following, it already exist with it's correct categoryId // and their categoryId field to that category id
  console.log(`[${category}] areThereDuplicates.length: `, areThereDuplicates.length);
  if (areThereDuplicates.length > 0) {
    console.log(`[${category}] updatedArticles START`);
    const updatedArticles = await db.article.updateMany({
      data: { top_headline: true },
      where: {
        slug: {
          in: currentSlugs
        }
      }
    });
    console.log(`[${category}] [prisma] updatedArticles: `, updatedArticles);
  }
  // if no, or all the rest if some was yes, loop and save to the db as new articles with top_headline field true and categoryId: top-headline.id
  console.log(`[${category}] savedArticles START`);
  const savedArticles = await db.article.createMany({
    data: articlesWithSourceid,
    skipDuplicates: true
  });
  console.log(`[${category}] [prisma] savedArticles:`, savedArticles);

  // check that there are new articles, and newLastDate has the updated last_date
  if (newLastDate > new Date(last_date)) {
    console.log(`[${category}] lastDate: `, new Date(last_date));
    console.log(`[${category}] newLastDate: `, newLastDate);
    console.log(`[${category}] Updating last_date to db...`);
    const updatedLastDateRes = await updateLastDate({ newLastDate, currentCategory });
    if (updatedLastDateRes && updatedLastDateRes.last_date) {
      console.log(`[${category}] Updated last_date on db, updatedLastDateRes: `, updatedLastDateRes.last_date);
    }
  }

  console.timeEnd(`[${category}] [Time] GET Route`);
  return NextResponse.json({
    status: 200,
    last_date: last_date,
    newLastDate: newLastDate,
    articles: articlesWithSourceid.length,
    areThereDuplicates: areThereDuplicates,
    savedArticles: savedArticles
  });
}
