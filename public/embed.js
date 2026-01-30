(function () {
    // Veritas Link Embed Script
    const script = document.currentScript;
    const container = document.createElement('div');
    container.id = 'veritas-link-container';
    container.style.width = '100%';
    container.style.maxWidth = '400px';
    container.style.margin = '20px auto';

    script.parentNode.insertBefore(container, script);

    // Scrape Context from Parent
    const title = document.title;
    const h1 = document.querySelector('h1') ? document.querySelector('h1').innerText : '';
    const contextText = (title + ' ' + h1).toLowerCase();

    let keyword = 'general';
    if (contextText.includes('fed') || contextText.includes('rate')) keyword = 'Fed';
    if (contextText.includes('bitcoin') || contextText.includes('crypto')) keyword = 'Bitcoin';
    if (contextText.includes('election')) keyword = 'Election';

    // Create Iframe pointing to our App
    // Note: In production, localhost:3000 would be the deployed URL
    const iframe = document.createElement('iframe');
    iframe.src = `http://localhost:3000/?keyword=${encodeURIComponent(keyword)}&embed=true`;
    iframe.style.width = '100%';
    iframe.style.height = '400px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.overflow = 'hidden';

    container.appendChild(iframe);
})();
