import { NextResponse } from 'next/server';

export async function GET() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Missing Cloudinary credentials in environment variables' }, { status: 500 });
  }

  try {
    // Cloudinary Admin API requires Basic Authentication: base64(api_key:api_secret)
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/usage`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
        // Revalidate usage data every 5 minutes
        next: { revalidate: 300 }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: 'Cloudinary API error', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Cloudinary stats error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
