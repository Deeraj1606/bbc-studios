import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const REVIEWS_PATH = path.join(process.cwd(), 'data', 'reviews.json');

async function getReviews() {
    if (!existsSync(REVIEWS_PATH)) {
        return [];
    }
    const content = await readFile(REVIEWS_PATH, 'utf-8');
    return JSON.parse(content);
}

async function saveReviews(reviews: any[]) {
    await writeFile(REVIEWS_PATH, JSON.stringify(reviews, null, 2));
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');

    if (!contentId) {
        return NextResponse.json({ error: 'Content ID is required' }, { status: 400 });
    }

    try {
        const allReviews = await getReviews();
        const filtered = allReviews.filter((r: any) => r.contentId === contentId);
        return NextResponse.json(filtered);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { contentId, user, rating, comment } = body;

        if (!contentId || !rating) {
            return NextResponse.json({ error: 'Content ID and Rating are required' }, { status: 400 });
        }

        const newReview = {
            id: Date.now().toString(),
            contentId,
            user: user || 'Anonymous',
            rating,
            comment: comment || '', // Allow empty comments
            helpful: 0,
            timestamp: Date.now()
        };

        const reviews = await getReviews();
        reviews.unshift(newReview);
        await saveReviews(reviews);

        return NextResponse.json(newReview);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
    }
}
