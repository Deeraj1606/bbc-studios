import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const dbPath = path.join(process.cwd(), 'data', 'content.json');

        if (!existsSync(dbPath)) {
            return NextResponse.json([]);
        }

        const dbContent = await readFile(dbPath, 'utf-8');
        const database = JSON.parse(dbContent);

        return NextResponse.json(database);
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json([], { status: 500 });
    }
}
