
import { MarketData } from './market-aggregator';

export interface PolymarketEvent {
    id: string;
    title: string;
    slug: string;
    image?: string;
    icon?: string;
    markets: PolymarketMarket[];
}

export interface PolymarketMarket {
    id: string;
    question: string;
    outcomes: string; // JSON string e.g. "[\"Yes\", \"No\"]"
    outcomePrices: string; // JSON string e.g. "[\"0.25\", \"0.75\"]"
    active: boolean;
    closed: boolean;
    volume: string; // API returns volume as string "1234.56"
    clobTokenIds: string; // JSON string e.g. "[\"token1\", \"token2\"]"
}

export async function searchPolymarket(keyword: string): Promise<MarketData[]> {
    try {
        const response = await fetch(`https://gamma-api.polymarket.com/events?closed=false&q=${encodeURIComponent(keyword)}&limit=10`);

        if (!response.ok) {
            console.error('Polymarket API Error:', response.statusText);
            return [];
        }

        const events: PolymarketEvent[] = await response.json();
        const results: MarketData[] = [];

        for (const event of events) {
            // Process each market within the event
            for (const market of event.markets) {
                if (market.active && !market.closed) {
                    try {
                        const outcomes = JSON.parse(market.outcomes);
                        const prices = JSON.parse(market.outcomePrices);

                        // We are looking for Binary "Yes" markets mainly
                        const yesIndex = outcomes.findIndex((o: string) => o === 'Yes');

                        if (yesIndex !== -1 && prices[yesIndex]) {
                            const probability = parseFloat(prices[yesIndex]) * 100;
                            let tokenIds: string[] = [];
                            try {
                                tokenIds = JSON.parse(market.clobTokenIds);
                            } catch (e) {
                                // consistent with existing error handling
                            }

                            results.push({
                                id: `poly-${market.id}`,
                                question: market.question,
                                probability: Math.round(probability),
                                source: 'Polymarket',
                                url: `https://polymarket.com/event/${event.slug}`,
                                image: event.icon || event.image, // Polymarket API usually provides 'icon' or 'image' at event level
                                volume: parseFloat(market.volume || '0'),
                                clobTokenIds: tokenIds
                            });
                        }
                    } catch (e) {
                        console.warn('Failed to parse polymarket data', e);
                    }
                }
            }
        }

        return results;

    } catch (error) {
        console.error('Failed to fetch from Polymarket:', error);
        return [];
    }
}
