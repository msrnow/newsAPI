import { NextResponse } from 'next/server';
import generateCombinations from '@/utils/generateShortSlugs';
import generateShortSlugs from '@/utils/generateShortSlugs';

export async function GET() {
  // console.time('short_slug1');
  // const short_slug1 = generateCombinations(1); //? time
  // console.timeEnd('short_slug1');

  // console.time('short_slug2');
  // const short_slug2 = generateCombinations(10000); //? time
  // console.timeEnd('short_slug2');

  // console.time('short_slug3');
  // for (let i = 0; i < 10000; i++) {
  //   const short_slug3 = generateCombinations(1); //? time
  // }
  // console.timeEnd('short_slug3');

  // ///

  console.time('short_slug4');
  const short_slug1 = generateShortSlugs(1); //? time
  const short_slug2 = generateShortSlugs(1); //? time
  const short_slug3 = generateShortSlugs(1); //? time
  const short_slug4 = generateShortSlugs(1); //? time
  const short_slug51 = generateShortSlugs(1); //? time
  const short_slug6 = generateShortSlugs(1); //? time
  const short_slug7 = generateShortSlugs(1); //? time
  const short_slug8 = generateShortSlugs(1); //? time
  const short_slug9 = generateShortSlugs(1); //? time
  const short_slug10 = generateShortSlugs(1); //? time
  console.timeEnd('short_slug4');

  console.time('short_slug5');
  const short_slug5 = generateShortSlugs(10000); //? time
  console.timeEnd('short_slug5');
  console.log('short_slug5: ', short_slug5.length);

  // console.time('short_slug6');
  // for (let i = 0; i < 10000; i++) {
  //   const short_slug6 = generateShortSlugs(1); //? time
  // }
  // console.timeEnd('short_slug6');

  return NextResponse.json({ status: 200 });
}
