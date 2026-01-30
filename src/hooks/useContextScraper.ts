
import { useState, useEffect } from 'react';

/**
 * Hook to scrape the current page context to find relevant keywords.
 * In a real embed scenario, this would arguably look at the parent window if iframe,
 * or the current window if directly integrated.
 */
export function useContextScraper() {
    const [contextKeyword, setContextKeyword] = useState<string>('');

    useEffect(() => {
        // 1. Check URL Params (for Embeds)
        const params = new URLSearchParams(window.location.search);
        const urlKeyword = params.get('keyword');
        if (urlKeyword) {
            setContextKeyword(urlKeyword);
            return;
        }

        // 2. Scrape Page (for Direct Integration)
        // If the page title mentions "Fed", we assume financial context.
        const title = document.title.toLowerCase();
        const h1 = document.querySelector('h1')?.innerText.toLowerCase() || '';

        if (title.includes('fed') || title.includes('rate') || title.includes('economy') ||
            h1.includes('fed') || h1.includes('rate') || h1.includes('economy')) {
            setContextKeyword('Fed');
        } else if (title.includes('vote') || title.includes('election')) {
            setContextKeyword('election');
        } else {
            // Default fallback if no specific context found
            setContextKeyword('general');
        }

    }, []);

    return contextKeyword;
}
