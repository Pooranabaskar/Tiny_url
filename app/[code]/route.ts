import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /:code - Redirect to the original URL
 * Returns: 302 redirect if found, 404 if not found or deleted
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link || link.deleted) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Update click statistics
    await prisma.link.update({
      where: { code },
      data: {
        total_clicks: { increment: 1 },
        last_clicked: new Date(),
      },
    });

    // Return 302 redirect
    return NextResponse.redirect(link.target_url, { status: 302 });
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
