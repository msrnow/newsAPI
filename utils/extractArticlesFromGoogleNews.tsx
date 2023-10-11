// import * as cheerio from 'cheerio';

// export default async function ExtractArticlesFromGoogleNews(page: string) {
//   const $ = cheerio.load(page, { xmlMode: true });

//   const articles = await Promise.all(
//     $('article.IBr9hb, article.IFHyqb.DeXSAc')
//       .filter((_, article) => {
//         const hasImage = $(article).find('img.Quavad').length > 0;
//         const isSupportedSource = sources.some((s) => s.name === $(article).find('.vr1PYe').text().trim());
//         const articleDatetime = $(article).find('time.hvbAAd').attr('datetime');
//         if (articleDatetime && last_date) {
//           const isRecent = new Date(articleDatetime) > new Date(last_date);
//           const isNewLastDate = newLastDate ? new Date(articleDatetime) > newLastDate : false;
//           if (isNewLastDate) {
//             newLastDate = new Date(articleDatetime);
//           }
//           return hasImage && isSupportedSource && isRecent;
//         }
//         return false;
//       })
//       .map(async (_, article) => {
//         const articleObj = {
//           scraped_from: scrapedFromSource,
//           title: sanitizeTitle($(article).find('h4').text().trim()),
//           google_thumb: $(article).find('img.Quavad').attr('src'),
//           article_google_url: `${scrapedFromSource}${$(article).find('a').attr('href')}`,
//           slug: sanitizeSlug($(article).find('h4').text().trim()),
//           published_at: $(article).find('time.hvbAAd').attr('datetime'),
//           sourceId: sources.filter((s) => s.name === $(article).find('.vr1PYe').text().trim())[0].id,
//           categoryId: currentCategory.id,
//           short_slug: generateShortSlugs(1)[0]
//         };
//         return articleObj;
//       })
//       .get()
//   );
//   return articles;
// }
