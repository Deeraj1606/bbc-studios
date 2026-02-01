import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ name: string }> }
) {
    const params = await props.params;
    const actorName = decodeURIComponent(params.name);

    try {
        const dbPath = path.join(process.cwd(), 'data', 'actors.json');

        if (!existsSync(dbPath)) {
            return NextResponse.json({ name: actorName }); // Return basic if no DB
        }

        const dbContent = await readFile(dbPath, 'utf-8');
        const database = JSON.parse(dbContent);

        const actor = database.find((item: any) =>
            item.name.toLowerCase() === actorName.toLowerCase()
        );

        if (!actor) {
            return NextResponse.json({ name: actorName }); // Return basic if not found
        }

        return NextResponse.json(actor);
    } catch (error) {
        console.error('Error fetching actor:', error);
        return NextResponse.json({ name: actorName });
    }
}
