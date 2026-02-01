import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'actors.json');

async function getActors() {
    if (!existsSync(DB_PATH)) {
        return [];
    }
    const content = await import('fs').then(fs => fs.promises.readFile(DB_PATH, 'utf-8'));
    return JSON.parse(content);
}

async function saveActors(actors: any[]) {
    const dir = path.dirname(DB_PATH);
    if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
    }
    await writeFile(DB_PATH, JSON.stringify(actors, null, 2));
}

export async function GET() {
    try {
        const actors = await getActors();
        return NextResponse.json(actors);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch actors' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const bio = formData.get('bio') as string;
        const imageFile = formData.get('image') as File | null;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        let imageUrl = '';
        if (imageFile) {
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'actors');
            if (!existsSync(uploadsDir)) {
                await mkdir(uploadsDir, { recursive: true });
            }
            const ext = imageFile.name.split('.').pop();
            const filename = `actor_${Date.now()}.${ext}`;
            const bytes = await imageFile.arrayBuffer();
            await writeFile(path.join(uploadsDir, filename), Buffer.from(bytes));
            imageUrl = `/uploads/actors/${filename}`;
        }

        const newActor = {
            id: Date.now().toString(),
            name,
            bio,
            imageUrl,
            movies: []
        };

        const actors = await getActors();
        actors.push(newActor);
        await saveActors(actors);

        return NextResponse.json(newActor);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add actor' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const bio = formData.get('bio') as string;
        const imageFile = formData.get('image') as File | null;
        let imageUrl = formData.get('imageUrl') as string;

        if (!id || !name) {
            return NextResponse.json({ error: 'ID and Name are required' }, { status: 400 });
        }

        if (imageFile) {
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'actors');
            if (!existsSync(uploadsDir)) {
                await mkdir(uploadsDir, { recursive: true });
            }
            const ext = imageFile.name.split('.').pop();
            const filename = `actor_${Date.now()}.${ext}`;
            const bytes = await imageFile.arrayBuffer();
            await writeFile(path.join(uploadsDir, filename), Buffer.from(bytes));
            imageUrl = `/uploads/actors/${filename}`;
        }

        const actors = await getActors();
        const index = actors.findIndex((a: any) => a.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Actor not found' }, { status: 404 });
        }

        actors[index] = {
            ...actors[index],
            name,
            bio,
            imageUrl
        };

        await saveActors(actors);
        return NextResponse.json(actors[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update actor' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const actors = await getActors();
        const updatedActors = actors.filter((a: any) => a.id !== id);
        await saveActors(updatedActors);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete actor' }, { status: 500 });
    }
}
