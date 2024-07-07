import { type NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const handler = async (
  _: NextRequest,
  { params: { soundId } }: { params: { soundId: string } },
) => {
  const filePath = path.join(process.cwd(), 'public', 's', `${soundId}.mp3`);

  try {
    await fs.access(filePath); // Check if file exists
    const fileBuffer = await fs.readFile(filePath);
    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');

    return new NextResponse(fileBuffer, { headers });
  } catch (err) {
    return new NextResponse('File not found', { status: 404 });
  }
};

export { handler as GET, handler as POST };
