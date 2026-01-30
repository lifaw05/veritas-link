
import { NextResponse } from 'next/server';
import { aggregateMarkets } from '@/utils/market-aggregator';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');

    if (!keyword) {
        return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    try {
        const markets = await aggregateMarkets(keyword);
        return NextResponse.json({ markets });
    } catch (error) {
        console.error('Error fetching markets:', error);
        return NextResponse.json({ error: 'Failed to fetch markets' }, { status: 500 });
    }
}
