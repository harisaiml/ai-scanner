// API Route: Start a new scan
import { NextRequest, NextResponse } from 'next/server';
import { ScanService, saveScanResults } from '@/lib/services/scan';
import type { ScanInput } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.websiteUrl) {
      return NextResponse.json(
        { error: 'Website URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(body.websiteUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const input: ScanInput = {
      websiteUrl: body.websiteUrl,
      companyName: body.companyName,
      industry: body.industry,
      location: body.location,
      employeesCount: body.employeesCount,
      leadsPerMonth: body.leadsPerMonth ? parseInt(body.leadsPerMonth) : undefined,
      currentCrm: body.currentCrm,
      additionalContext: body.additionalContext,
    };

    const scanService = new ScanService();
    const scanId = await scanService.initiateScan(input);

    // Start the scan in the background (non-blocking)
    // In production, this would be a separate job queue
    scanService.executeScan(scanId, input).then(async (result) => {
      // Save results to database
      if (result.businessProfile) {
        await saveScanResults(
          scanId,
          result.businessProfile,
          result.opportunities || [],
          result.blueprints || [],
          result.report!
        );
      }
    }).catch((error) => {
      console.error('Scan execution error:', error);
    });

    return NextResponse.json({
      scanId,
      status: 'started',
      message: 'Scan initiated successfully',
    });
  } catch (error: any) {
    console.error('Error starting scan:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start scan' },
      { status: 500 }
    );
  }
}
