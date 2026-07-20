import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetches securely using the private server-side process.env.BLOB_READ_WRITE_TOKEN
    const { blobs } = await list({ prefix: 'images/' });
    const urls = blobs.map((blob) => blob.url);
    
    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Failed to list blobs:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
