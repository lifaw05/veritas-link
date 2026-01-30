
import { searchPolymarket } from './polymarket';

export interface MarketData {
    id: string;
    question: string;
    probability: number; // 0-100
    source: 'Kalshi' | 'Polymarket';
    url: string;
    image?: string;
    volume?: number;
    clobTokenIds?: string[];
}

/**
 * Aggregates markets from all sources.
 * Currently configured for Polymarket only.
 */
export async function aggregateMarkets(keyword: string): Promise<MarketData[]> {
    const [polymarketData] = await Promise.all([
        searchPolymarket(keyword)
    ]);

    return [...polymarketData];
}
