import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const genre = formData.get('genre') as string;
        const duration = formData.get('duration') as string;
        const rating = formData.get('rating') as string;
        const type = formData.get('type') as string;
        const year = formData.get('year') as string;
        const director = formData.get('director') as string;
        const musicDirector = formData.get('musicDirector') as string;
        const cast = formData.get('cast') as string;


        const videoFile = formData.get('video') as File | null;
        const thumbnailFile = formData.get('thumbnail') as File | null;

        if (!title || !videoFile || !thumbnailFile) {
            return NextResponse.json(
                { error: 'Title, video, and thumbnail are required' },
                { status: 400 }
            );
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const videosDir = path.join(uploadsDir, 'videos');
        const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }
        if (!existsSync(videosDir)) {
            await mkdir(videosDir, { recursive: true });
        }
        if (!existsSync(thumbnailsDir)) {
            await mkdir(thumbnailsDir, { recursive: true });
        }

        // Generate unique filenames
        const timestamp = Date.now();
        const videoExt = videoFile.name.split('.').pop();
        const thumbnailExt = thumbnailFile.name.split('.').pop();

        const videoFilename = `video_${timestamp}.${videoExt}`;
        const thumbnailFilename = `thumb_${timestamp}.${thumbnailExt}`;

        // Save video file
        const videoBytes = await videoFile.arrayBuffer();
        const videoBuffer = Buffer.from(videoBytes);
        await writeFile(path.join(videosDir, videoFilename), videoBuffer);

        // Save thumbnail file
        const thumbnailBytes = await thumbnailFile.arrayBuffer();
        const thumbnailBuffer = Buffer.from(thumbnailBytes);
        await writeFile(path.join(thumbnailsDir, thumbnailFilename), thumbnailBuffer);

        // Create content object
        const content = {
            id: timestamp.toString(),
            title,
            description,
            genre: genre.split(',').map(g => g.trim()),
            duration,
            rating,
            type,
            year: parseInt(year),
            director,
            musicDirector,
            cast: cast.split(',').map(c => c.trim()),
            videoUrl: `/uploads/videos/${videoFilename}`,
            thumbnailUrl: `/uploads/thumbnails/${thumbnailFilename}`,
            uploadedAt: new Date().toISOString(),
            views: 0,
            maturityRating: 0
        };

        // Save to database (JSON file for now)
        const dbPath = path.join(process.cwd(), 'data', 'content.json');
        const dbDir = path.join(process.cwd(), 'data');

        if (!existsSync(dbDir)) {
            await mkdir(dbDir, { recursive: true });
        }

        let database: any[] = [];
        if (existsSync(dbPath)) {
            const dbContent = await import('fs').then(fs =>
                fs.promises.readFile(dbPath, 'utf-8')
            );
            database = JSON.parse(dbContent);
        }

        database.unshift(content);
        await writeFile(dbPath, JSON.stringify(database, null, 2));

        return NextResponse.json({
            success: true,
            content,
            message: 'Content uploaded successfully!'
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload content', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const dbPath = path.join(process.cwd(), 'data', 'content.json');

        if (!existsSync(dbPath)) {
            return NextResponse.json([]);
        }

        const dbContent = await import('fs').then(fs =>
            fs.promises.readFile(dbPath, 'utf-8')
        );
        const database = JSON.parse(dbContent);

        return NextResponse.json(database);
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json(
            { error: 'Failed to fetch content' },
            { status: 500 }
        );
    }
}
