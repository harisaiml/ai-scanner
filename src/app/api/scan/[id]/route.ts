// API Route: Get scan status and results
import { NextRequest, NextResponse } from 'next/server';
import { getScanStatus, getScanResults } from '@/lib/services/scan';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Scan ID is required' },
        { status: 400 }
      );
    }

    const scan = await getScanStatus(id);

    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      );
    }

    // If scan is completed, also return results
    if (scan.status === 'completed') {
      const results = await getScanResults(id);
      return NextResponse.json({
        scan,
        ...results,
      });
    }

    // Return status for pending/running/failed scans
    return NextResponse.json({
      scan,
      businessProfile: null,
      opportunities: [],
      blueprints: [],
      report: null,
    });
  } catch (error: any) {
    console.error('Error fetching scan:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch scan' },
      { status: 500 }
    );
  }
}
