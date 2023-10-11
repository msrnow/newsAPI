import { db } from '@/lib/db';
import { newArticlesType, relatedArticleType, sourceType } from '@/types';
import * as cheerio from 'cheerio';
import { sanitizeTitle } from '@/utils/sanitizeTitle';
import { sanitizeSlug } from '@/utils/sanitizeSlug';
import generateShortSlugs from '@/utils/generateShortSlugs';
// import { sources } from '@/data/static/sources';
// const util = require('util');

export default async function ScrapeRelatedArticles(
  related_coverage_url: string,
  short_slug: string,
  categoryId: number
): Promise<relatedArticleType[]> {
  console.time('relateCoverage get Route');

  console.time('tweetsPage and $tweets');
  console.log('related_coverage_url: ', related_coverage_url);
  const tweetsPage = await fetch(related_coverage_url, { cache: 'no-cache' }).then((res) => res.text());
  const $tweets = cheerio.load(tweetsPage, { xmlMode: true });
  console.timeEnd('tweetsPage and $tweets');

  // don't scrape tweets, Tweet component doesn't work in prod bc of X
  const tweets = await Promise.all(
    $tweets('div.IlHKxe').map(async (i, t) => {
      const tweetHref = $tweets(t).find('a.cihWJ').attr('href');
      console.log('tweetHref: ', tweetHref);
      const tweetId = tweetHref?.slice(-19, tweetHref.length);
      const tweetDate = $tweets(t).find('div.eGzQsf time').attr('datetime');
      return `${tweetId}/${tweetDate}`;
    })
  );
  const tweetsIds = tweets.join(',');
  console.log('🚀 ~ file: scrapeRelatedNews.tsx:44 ~ tweetsIds:', tweetsIds);

  const coveragePage = await fetch(`${related_coverage_url}&so=1`, { cache: 'no-cache' }).then((res) => res.text());
  const $coverage = cheerio.load(coveragePage, { xmlMode: true });

  const scrapedFromSource = 'https://news.google.com/';
  let currentSources: { name: string }[] = [];
  let updatedSourcesFromDB: sourceType[] = [];

  const updateCurrentSources = (
    allSources: {
      id: number;
      name: string;
      url: string | null;
      scrapable: number | null;
      content_selector: string | null;
    }[]
  ) => {
    console.log('[updateCurrentSources] allSources: ', allSources[0], ' - ', allSources.length);
    updatedSourcesFromDB = allSources;
    console.log(
      '[updateCurrentSources] updatedSourcesFromDB: ',
      updatedSourcesFromDB[0],
      ' - ',
      updatedSourcesFromDB.length
    );
  };

  const getSourceId = (sourceName: string) => {
    const source = updatedSourcesFromDB.filter((s) => s.name === sourceName);
    return source[0]?.id || sourceName;
  };

  const getSourceIdByName = (sourceName: string) => {
    const source = updatedSourcesFromDB.filter((s) => s.name.trim() === sourceName.trim());
    return source[0]?.id;
  };

  let newShortSlugs: string[] = [short_slug];

  const articles = await Promise.all(
    $coverage('div.NiLAwe')
      .filter((_, article) => {
        const hasImage = $coverage(article).find('img.tvs3Id.QwxBBf').length > 0;
        if (hasImage) {
          const articleSource = $coverage(article).find('.wEwyrc');
          currentSources.push({ name: articleSource.text() });
          const new_short_slug = generateShortSlugs(1)[0];
          newShortSlugs.unshift(new_short_slug);
        }
        return hasImage;
      })
      .map(async (i, article) => {
        let allSources: sourceType[] = [];
        if (i === 0) {
          console.log('[i===0] currentSources[0]: ', currentSources[0]);
          console.time('allSource');
          allSources = await db.source.findMany({});
          console.log('allSources.length: ', allSources.length);
          console.timeEnd('allSource');

          const isNewSource = currentSources.filter((currentSource) => {
            return !allSources.some((allSource) => allSource.name === currentSource.name);
          });
          console.log('isNewSource.length: ', isNewSource.length);

          if (isNewSource.length) {
            console.time('currentSourceRes');
            const currentSourceRes = await db.source.createMany({
              data: currentSources,
              skipDuplicates: true
            });
            console.log('currentSourceRes: ', currentSourceRes);
            console.timeEnd('currentSourceRes');
            console.time('allSources');
            allSources = await db.source.findMany({});
            console.timeEnd('allSources');
          }

          console.log('[i===0] allSources.length: ', allSources.length);
          updateCurrentSources(allSources);
        }

        const sourceName = $coverage(article).find('a.wEwyrc').text().trim();
        const articleObj = {
          scraped_from: scrapedFromSource,
          title: sanitizeTitle($coverage(article).find('a.DY5T1d').text().trim()),
          google_thumb: $coverage(article).find('img.tvs3Id.QwxBBf').attr('src'),
          article_google_url: `${scrapedFromSource}${$coverage(article).find('a').attr('href')}`,
          slug: sanitizeSlug($coverage(article).find('a.DY5T1d').text().trim()),
          related_coverage_tweets: tweetsIds,
          published_at: $coverage(article).find('time.WW6dff').attr('datetime'),
          categoryId: categoryId,
          short_slug: newShortSlugs[i],
          related_coverage_article: newShortSlugs.join(','),
          sourceId: getSourceId(sourceName)
        };
        return articleObj;
      })
      .get()
  );

  console.log('articles[1]: ', articles[1], ' - ', articles.length);

  const coverageArticles = articles.map((a: any, i) => {
    const sourceId = typeof a.sourceId === typeof '' ? getSourceIdByName(a.sourceId) : a.sourceId;
    return { ...a, sourceId: sourceId };
  });

  console.log('before saving to db: coverageArticles[0]: ', coverageArticles[0], ' - ', coverageArticles.length);

  if (coverageArticles.length > 0) {
    const savedArticlesRes = await db.article.createMany({
      data: coverageArticles,
      skipDuplicates: true
    });
    console.log('savedArticlesRes: ', savedArticlesRes);

    const updatedMainArticleRes = await db.article.update({
      where: { short_slug: short_slug },
      data: {
        related_coverage_tweets: tweetsIds,
        related_coverage_article: newShortSlugs.join(',')
      }
    });
    console.log('updatedMainArticleRes (the short_slug is): ', updatedMainArticleRes.short_slug);
  }

  console.timeEnd('relateCoverage get Route');
  return coverageArticles.length > 0 ? coverageArticles : [];
}
