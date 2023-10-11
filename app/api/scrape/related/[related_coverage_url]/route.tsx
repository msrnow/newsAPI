import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest, params: { params: { related_coverage_url: string } }) {
  const { related_coverage_url } = params.params;
  console.log('related_coverage_url: ', related_coverage_url);

  return NextResponse.json({
    status: 200,
    message: 'Scraping related news to this piece of news, scraping in a timeline style',
    related_coverage_url
  });
}
