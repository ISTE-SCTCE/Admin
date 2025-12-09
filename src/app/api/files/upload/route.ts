import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + path.extname(file.name);

        // Save to public/uploads
        const uploadDir = path.join(process.cwd(), 'public/uploads');

        // Ensure upload dir exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // ignore if exists
        }

        await writeFile(path.join(uploadDir, filename), buffer);

        // Get current user from cookie
        const cookieStore = await cookies();
        const uploadedBy = cookieStore.get('user_name')?.value || 'Admin';

        // Save metadata to DB
        const newFile = await db.files.create({
            filename: filename,
            original_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            uploaded_by: uploadedBy,
            file_path: `/uploads/${filename}`
        });

        return NextResponse.json({ success: true, file: newFile });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
    }
}
