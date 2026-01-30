import { NextResponse } from 'next/server';
import { aggregateMarkets, MarketData } from '@/utils/market-aggregator';

// Strict DTO to prevent data leakage
// Only explicitly allowed fields are sent to the client.
interface SafeMarketDTO {
    title: string;       // Mapped from question
    probability: number;
    source: string;
    url: string;         // Essential for UX
    image?: string;      // Visuals
    // id is excluded if not strictly needed, or we can hash it. 
    // For now, we keep a sanitized ID for React keys if it's just a public identifier.
    id: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');

    if (!keyword) {
        return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    try {
        const rawMarkets = await aggregateMarkets(keyword);

        // Sanitize Data: Strictly map to SafeMarketDTO
        const safeMarkets: SafeMarketDTO[] = rawMarkets.map(m => ({
            id: m.id, // Public Market ID is safe
            title: m.question, // Rename 'question' to 'title' for clarity or keep as is? Widget uses question.
            // Let's keep it compatible with frontend or update frontend? 
            // The prompt asked to show "Event Title", let's map 'question' -> 'question' 
            // but ensure we don't pass whole object.
            // Actually, let's keep the frontend interface 'question' to avoid breaking UI changes in a security task.
            // But we explicitly pick the properties.
            question: m.question,
            probability: m.probability,
            source: m.source,
            url: m.url,
            image: m.image
        }));

        return NextResponse.json({ markets: safeMarkets });
    } catch (error) {
        console.error('Error fetching markets:', error);
        return NextResponse.json({ error: 'Failed to fetch markets' }, { status: 500 });
    }
}
