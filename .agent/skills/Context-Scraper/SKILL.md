---
name: Context-Scraper
description: Scrapes host page metadata to generate context keywords.
---

# Context Scraper

This skill uses the Browser Agent (or simple DOM scripts) to understand the page context.

## Instructions

1.  **Target Elements**:
    -   `<meta name="keywords">`
    -   `<meta property="og:title">`
    -   `<h1>` tags.
    -   URL path segments.

2.  **Logic**:
    -   Extract text from these elements.
    -   Filter common stop words.
    -   Return top 3-5 keywords.

## Code Snippet (JS for Browser Console)

```javascript
function getContext() {
    const metaKeywords = document.querySelector('meta[name="keywords"]')?.content || "";
    const ogTitle = document.querySelector('meta[property="og:title"]')?.content || "";
    const h1 = document.querySelector('h1')?.innerText || "";
    
    const combined = \`\${metaKeywords} \${ogTitle} \${h1}\`;
    // Simple mock extraction
    return combined.split(" ").filter(w => w.length > 4).slice(0, 5);
}
return getContext();
```
