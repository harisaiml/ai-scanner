// API Route: Standalone research endpoint
import { NextRequest, NextResponse } from 'next/server';
import { researchWebsite } from '@/lib/services/research';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(body.url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const research = await researchWebsite(body.url);

    if (!research) {
      return NextResponse.json(
        { error: 'Failed to research website' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: research,
    });
  } catch (error: any) {
    console.error('Error researching website:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to research website' },
      { status: 500 }
    );
  }
}
