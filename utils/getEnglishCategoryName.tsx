export default function getEnglishCategoryName(category: string): string {
  if (category === 'أهم العناوين') return 'top-headline';
  else if (category === 'رائج الان') return 'trending'; // later differentiate between trending Vs most-viewed
  else if (category === 'أخر الأخبار') return 'latest';
  else if (category === 'أخبار مصر') return 'egypt';
  return '';
}
