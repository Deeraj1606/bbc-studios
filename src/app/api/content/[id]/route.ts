import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const getDbPath = () => path.join(process.cwd(), 'data', 'content.json');

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const dbPath = getDbPath();

        if (!existsSync(dbPath)) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        const dbContent = await readFile(dbPath, 'utf-8');
        const database = JSON.parse(dbContent);

        const content = database.find((item: any) => item.id === params.id);

        if (!content) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const dbPath = getDbPath();
        if (!existsSync(dbPath)) return NextResponse.json({ error: 'Database not found' }, { status: 404 });

        const dbContent = await readFile(dbPath, 'utf-8');
        const database = JSON.parse(dbContent);

        const filtered = database.filter((item: any) => item.id !== params.id);

        if (filtered.length === database.length) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        await writeFile(dbPath, JSON.stringify(filtered, null, 2));
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const formData = await request.formData();
        const dbPath = getDbPath();
        if (!existsSync(dbPath)) return NextResponse.json({ error: 'Database not found' }, { status: 404 });

        const dbContent = await readFile(dbPath, 'utf-8');
        const database = JSON.parse(dbContent);

        const index = database.findIndex((item: any) => item.id === params.id);
        if (index === -1) return NextResponse.json({ error: 'Content not found' }, { status: 404 });

        const currentContent = database[index];

        // Gather fields
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const genre = formData.get('genre') as string;
        const duration = formData.get('duration') as string;
        const rating = formData.get('rating') as string;
        const type = formData.get('type') as string;
        const year = formData.get('year') as string;
        const director = formData.get('director') as string;
        const cast = formData.get('cast') as string;

        const videoFile = formData.get('video') as File | null;
        const thumbnailFile = formData.get('thumbnail') as File | null;

        let videoUrl = currentContent.videoUrl;
        let thumbnailUrl = currentContent.thumbnailUrl;

        // Handle potential file updates
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const videosDir = path.join(uploadsDir, 'videos');
        const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

        if (videoFile && typeof videoFile !== 'string') {
            const videoExt = videoFile.name.split('.').pop();
            const videoFilename = `video_${params.id}_${Date.now()}.${videoExt}`;
            const videoBytes = await videoFile.arrayBuffer();
            await writeFile(path.join(videosDir, videoFilename), Buffer.from(videoBytes));
            videoUrl = `/uploads/videos/${videoFilename}`;
        }

        if (thumbnailFile && typeof thumbnailFile !== 'string') {
            const thumbnailExt = thumbnailFile.name.split('.').pop();
            const thumbnailFilename = `thumb_${params.id}_${Date.now()}.${thumbnailExt}`;
            const thumbnailBytes = await thumbnailFile.arrayBuffer();
            await writeFile(path.join(thumbnailsDir, thumbnailFilename), Buffer.from(thumbnailBytes));
            thumbnailUrl = `/uploads/thumbnails/${thumbnailFilename}`;
        }

        const updatedContent = {
            ...currentContent,
            title: title || currentContent.title,
            description: description || currentContent.description,
            genre: genre ? genre.split(',').map(g => g.trim()) : currentContent.genre,
            duration: duration || currentContent.duration,
            rating: rating || currentContent.rating,
            type: type || currentContent.type,
            year: year ? parseInt(year) : currentContent.year,
            director: director || currentContent.director,
            cast: cast ? cast.split(',').map(c => c.trim()) : currentContent.cast,
            videoUrl,
            thumbnailUrl,
            updatedAt: new Date().toISOString()
        };

        database[index] = updatedContent;

        await writeFile(dbPath, JSON.stringify(database, null, 2));
        return NextResponse.json(updatedContent);
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Failed to update content', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
