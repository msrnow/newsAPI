// import { db } from '@/lib/db';
import { db } from '@/lib/db';
import * as cheerio from 'cheerio';
// import { sources } from '@/data/static/sources';
import UpdateArticle from '@/utils/updateArticle';
import { singleArticleType } from '@/types';

export default async function ScrapeArticleContent(article: singleArticleType) {
  console.time('[Time] Scrape Article GET Route');
  console.log('[ScrapeArticleContent] ScrapeArticleContent...');
  console.log(
    '[ScrapeArticleContent] article.short_slug: ',
    article.short_slug,
    '\n   ',
    'article.article_source_url: ',
    article.article_source_url,
    '\n   ',
    'article.content: ',
    article.content
  );

  if (!article) {
    console.log('[ScrapeArticleContent] Article not found! (!article is true)... Exiting');
    // return { status: 404, message: 'article is empty.' };
    return article;
  }
  if (!article.slug) {
    console.log('[ScrapeArticleContent] Article slug not found! (!article.slug is true)... Exiting');
    // return { status: 404, message: 'slug is empty.' };
    return article;
  }
  if (article?.content ? article?.content?.length > 5 : false) {
    console.log('[ScrapeArticleContent] article?.content?.length > 5 is true!... Exiting');
    // console.timeEnd('[Time] Scrape Article GET Route');
    return article;
  }
  // if article_source_url already exist, meaning it's unscrapable, return the full article
  if (article?.article_source_url ? article?.article_source_url?.length > 5 : false) {
    console.log('[ScrapeArticleContent] article?.article_source_url?.length > 5 is true!... Exiting');
    console.timeEnd('[Time] Scrape Article GET Route');
    return article;
  }

  // const currentSource: sourceType | undefined = sources.find((c) => c.id === article.sourceId);
  const currentSource = await db.source.findUnique({ where: { id: article.sourceId } });
  // | {
  //     id: number;
  //     name: string;
  //     url: null;
  //     scrapable: number;
  //     content_selector: string | null;
  //   }

  // if source is not one of the acceptable sources, return the article (this shouldn't be possible considering the scraping filter)
  if (!currentSource) {
    console.log('[ScrapeArticleContent] !currentSource is true!... Exiting');
    return article;
  }

  const article_source_url_page = await fetch(article.article_google_url).then((res) => res.text());

  const article_source_url = cheerio.load(article_source_url_page, { xmlMode: true })('div.m2L3rb > a').attr('href');
  console.log('🚀 ScrapeArticleContent ~ article_source_url:', article_source_url);

  const MY_API_TOKEN = '39d217dc-36fd-4a41-83c3-55e9c30920fa';
  const browserless_api = `https://chrome.browserless.io/content?token=${MY_API_TOKEN}&blockAds&stealth`;
  const headers = {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json'
  };

  if (!article_source_url) {
    console.log('[ScrapeArticleContent] !article_source_url is true... Exiting');
    return article;
  }

  let article_page;
  let data;
  let updatedArticle;
  if (currentSource.scrapable) {
    if (currentSource.name === 'Al Masry Al Youm - المصري اليوم') {
      const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({
          url: article_source_url,
          rejectResourceTypes: ['image', 'stylesheet', 'font']
        })
      };
      console.time('article_page');
      article_page = await fetch(browserless_api, options).then((res) => res.text());
      console.timeEnd('article_page');
      // console.log('🚀 ~ file: route.ts:118 ~ GET ~ article_page:', article_page.slice(1800, 2000));
    } else {
      article_page = await fetch(article_source_url).then((res) => res.text());
    }

    if (!article_page) {
      return article;
    }

    const $ = cheerio.load(article_page.replace(/<!--[\s\S]*?-->/g, ''), { xmlMode: true });

    const description = $('meta[name="description"]')?.attr('content')?.trim();
    const keywords =
      $('meta[name="keywords"]')?.attr('content')?.trim() || $('meta[name="news_keywords"]')?.attr('content')?.trim();

    let content;
    if (currentSource.name === 'Al Masry Al Youm - المصري اليوم') {
      $('#ad-container, .min_related').remove(); // content_to_remove_selector
      content = $('#NewsStory').html()?.trim();
    } else if (currentSource.name === 'العربية') {
      $('.feed-card, .ad25, .hide-in-mobile').remove();
      content = $('#body-text')?.html()?.trim();
    } else {
      content = $(`${currentSource.content_selector ? currentSource.content_selector : ''}`)
        ?.html()
        ?.trim();
    }

    // clean the content
    content = content?.replace('&nbsp;', ' ');

    data = {
      article_source_url,
      keywords: keywords || null,
      description: description || null,
      content: content || null
    };
  } else {
    data = {
      article_source_url: article_source_url,
      keywords: null,
      description: null,
      content: null
    };
  }

  let updatedArticleRes = await UpdateArticle(data, article.slug);

  console.log('[ScrapeArticleContent] updatedArticleRes: ', updatedArticleRes);
  updatedArticle = { ...article, ...data }; // or updatedArticleRes

  console.timeEnd('[Time] Scrape Article GET Route');
  return updatedArticle;
}
