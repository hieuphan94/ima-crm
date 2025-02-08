import { readdir, stat, unlink, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    // Validation
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename with timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${randomString}-${file.name}`;

    const publicDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(publicDir, fileName);

    // Save file
    await writeFile(filePath, buffer);

    // Cleanup old files (optional)
    // Keep only files from the last 24 hours
    const cleanup = async () => {
      try {
        const files = await readdir(publicDir);
        const yesterday = Date.now() - 24 * 60 * 60 * 1000;

        for (const file of files) {
          const filePath = path.join(publicDir, file);
          const stats = await stat(filePath);
          if (stats.ctimeMs < yesterday) {
            await unlink(filePath);
          }
        }
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
    cleanup();

    return NextResponse.json({
      url: `/uploads/${fileName}`,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
