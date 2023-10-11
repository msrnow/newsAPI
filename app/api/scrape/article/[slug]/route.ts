import { NextResponse, NextRequest } from 'next/server';
import * as cheerio from 'cheerio';
import { db } from '@/lib/db';
// import { sources } from '@/data/static/sources';
import UpdateArticle from '@/utils/updateArticle';

export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest, params: { params: { slug: string } }) {
  console.time('[Time] Scrape Article GET Route');

  // 1- get short_slug (or slug for now)
  const { slug } = params.params;
  if (!slug) {
    return new NextResponse('slug is empty.', { status: 404 });
  }

  console.time('article');
  const article = await db.article.findUnique({
    where: { slug },
    select: {
      title: true,
      short_slug: true,
      content: true,
      google_thumb: true,
      article_google_url: true,
      article_source_url: true,
      description: true,
      keywords: true,
      views: true,
      likes: true,
      sourceId: true
    }
  });
  console.timeEnd('article');

  // console.log('🚀 ~ file: route.ts:63 ~ GET ~ article:', article);
  if (!article) {
    return new NextResponse('Article not found in db.', { status: 404 });
  }

  // if content already exist, return the full article
  if (article?.content ? article?.content?.length > 5 : false) {
    console.timeEnd('[Time] Scrape Article GET Route');
    return NextResponse.json({ status: 200, article });
  }

  // if article_source_url already exist, return the full article
  if (article?.article_source_url ? article?.article_source_url?.length > 5 : false) {
    console.timeEnd('[Time] Scrape Article GET Route');
    return NextResponse.json({ status: 200, article });
  }

  const sources = await db.source.findMany();

  console.time('currentSource');
  const currentSource = sources.find((c) => c.id === article.sourceId);
  console.timeEnd('currentSource');

  // console.log('🚀 ~ file: route.ts:69 ~ GET ~ currentSource:', currentSource);
  if (!currentSource) {
    return new NextResponse('Unsupported source.', { status: 404 });
  }

  console.time('article_source_url_page');
  const article_source_url_page = await fetch(article.article_google_url).then((res) => res.text());
  console.timeEnd('article_source_url_page');

  console.time('article_source_url');
  const article_source_url = cheerio.load(article_source_url_page, { xmlMode: true })('div.m2L3rb > a').attr('href');
  console.timeEnd('article_source_url');
  // console.log('🚀 ~ file: route.ts:88 ~ GET ~ article_source_url:', article_source_url);

  const MY_API_TOKEN = '39d217dc-36fd-4a41-83c3-55e9c30920fa';
  const browserless_api = `https://chrome.browserless.io/content?token=${MY_API_TOKEN}&blockAds&stealth`;
  const headers = {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json'
  };

  if (!article_source_url) {
    return new NextResponse('article_source_url not a valid url.', { status: 404 });
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
    } else {
      article_page = await fetch(article_source_url).then((res) => res.text());
    }
    if (!article_page) {
      return new NextResponse("article page (html) couldn't be scraped.", { status: 404 });
    }

    console.time('$');
    const $ = cheerio.load(article_page.replace(/<!--[\s\S]*?-->/g, ''), { xmlMode: true });
    console.timeEnd('$');

    console.time('description');
    const description = $('meta[name="description"]')?.attr('content')?.trim();
    console.timeEnd('description');
    // console.log('🚀 ~ file: route.ts:132 ~ GET ~ description:', description);

    console.time('keywords');
    const keywords =
      $('meta[name="keywords"]')?.attr('content')?.trim() || $('meta[name="news_keywords"]')?.attr('content')?.trim();
    console.timeEnd('keywords');
    // console.log('🚀 ~ file: route.ts:138 ~ GET ~ keywords:', keywords);

    let content;
    console.time('content');
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
    console.timeEnd('content');
    data = {
      article_source_url,
      keywords,
      description,
      content
    };
  } else {
    data = {
      article_source_url: article_source_url,
      keywords: article.keywords,
      description: article.description,
      content: article.content
    };
  }

  console.time('updatedArticleRes');
  let updatedArticleRes = await UpdateArticle(data, slug);
  console.timeEnd('updatedArticleRes');

  console.log('[route] updatedArticleRes: ', updatedArticleRes);
  updatedArticle = { ...article, ...data }; // or updatedArticleRes

  console.timeEnd('[Time] Scrape Article GET Route');
  return NextResponse.json({ status: 200, article, updatedArticle, updatedArticleRes });
}
