(function () {
    // Veritas Link Embed Script
    const script = document.currentScript;
    const container = document.createElement('div');
    container.id = `veritas-${Math.random().toString(36).substr(2, 9)}`;

    // Get explicit context if provided
    const forcedContext = script.getAttribute('data-context');

    container.style.width = '100%';
    container.style.maxWidth = '400px';
    container.style.margin = '20px auto';

    script.parentNode.insertBefore(container, script);

    let keyword = forcedContext || 'general';

    if (!forcedContext) {
        // Scrape Context from Parent if not forced
        const title = document.title;
        const h1 = document.querySelector('h1') ? document.querySelector('h1').innerText : '';
        const contextText = (title + ' ' + h1).toLowerCase();

        if (contextText.includes('fed') || contextText.includes('rate')) keyword = 'Fed';
        if (contextText.includes('bitcoin') || contextText.includes('crypto')) keyword = 'Bitcoin';
        if (contextText.includes('election')) keyword = 'Election';
    }

    // Create Iframe pointing to our App
    const iframe = document.createElement('iframe');
    const baseUrl = 'https://merry-pothos-f8368d.netlify.app';
    iframe.src = `${baseUrl}/?keyword=${encodeURIComponent(keyword)}&embed=true`;
    iframe.style.width = '100%';
    iframe.style.height = '500px'; // Increased height to accommodate new features
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.overflow = 'hidden';

    container.appendChild(iframe);
})();
