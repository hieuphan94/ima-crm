import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');

    if (!imagePath) {
      return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
    }

    // Remove leading slash and join with public directory
    const fullPath = path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''));

    // Thêm validation cho file tồn tại
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Thêm validation cho file type
    const fileExtension = path.extname(fullPath).toLowerCase();
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const imageBuffer = fs.readFileSync(fullPath);
    const base64Image = imageBuffer.toString('base64');

    // Detect MIME type based on extension
    const mimeType = fileExtension === '.png' ? 'image/png' : 'image/jpeg';

    return NextResponse.json({
      data: `data:${mimeType};base64,${base64Image}`,
      mimeType: mimeType,
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
