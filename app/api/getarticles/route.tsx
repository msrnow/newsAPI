import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, params: { params: { slug: string } }) {
  return new NextResponse('Not implemented.', { status: 200 });
}
