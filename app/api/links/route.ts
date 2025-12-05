import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateShortCode, isValidCode, isValidUrl, normalizeUrl } from '@/lib/utils';

/**
 * POST /api/links - Create a new short link
 * Body: { url: string, code?: string }
 * Returns: 201 with link data, 409 if code exists, 400 if validation fails
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, code } = body;

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeUrl(url);
    if (!isValidUrl(normalizedUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Handle custom code or generate one
    let finalCode: string;
    let existingLink;
    
    if (code) {
      if (!isValidCode(code)) {
        return NextResponse.json(
          { error: 'Code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }
      finalCode = code;
      // Check if custom code already exists (and is not deleted)
      existingLink = await prisma.link.findUnique({
        where: { code: finalCode },
      });
      
      if (existingLink && !existingLink.deleted) {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        );
      }
    } else {
      // Generate a unique code (skip deleted links to allow reuse)
      let attempts = 0;
      do {
        finalCode = generateShortCode(6);
        attempts++;
        if (attempts > 10) {
          return NextResponse.json(
            { error: 'Failed to generate unique code' },
            { status: 500 }
          );
        }
        existingLink = await prisma.link.findUnique({ where: { code: finalCode } });
      } while (existingLink && !existingLink.deleted);
    }

    // Create or update link
    const link = await prisma.link.upsert({
      where: { code: finalCode },
      update: {
        target_url: normalizedUrl,
        deleted: false,
        total_clicks: 0,
        last_clicked: null,
      },
      create: {
        code: finalCode,
        target_url: normalizedUrl,
        deleted: false,
        total_clicks: 0,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/links - List all non-deleted links
 */
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      where: { deleted: false },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
