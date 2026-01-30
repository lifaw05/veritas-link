# Veritas Link

**Veritas Link** is a context-aware prediction market widget that embeds Polymarket probabilities into any article or webpage.

## Features
- **Context Awareness**: Automatically detects topics (e.g., "Fed Rates", "Bitcoin") from the parent page.
- **Real-Time Data**: Fetches live probabilities from the Polymarket Gamma API.
- **Geo-Fencing**: Asynchronously detects VPNs and restricted regions using `ipapi.is`.
- **Privacy First**: No tracking, simple iframe integration.
- **Glassmorphism UI**: Premium aesthetic with dark/light mode support.

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the widget.

## Usage (Embed)
To embed this widget on a third-party site, add the following script:

```html
<script src="https://your-deployed-domain.com/embed.js"></script>
```

Ensure the `embed.js` file in `public/` is updated to point to your production domain instead of `localhost:3000`.

### Testing Embeds
Open `public/demo.html` locally to see how the embed works in a "news site" context.

## Deployment

### Netlify (Target)
1.  Push this repository to GitHub/GitLab/Bitbucket.
2.  Log in to [Netlify](https://app.netlify.com/).
3.  Click **"Add new site"** -> **"Import an existing project"**.
4.  Select your repository.
5.  **Build Settings** (detected automatically via `netlify.toml`):
    - **Build Command**: `npm run build`
    - **Publish Directory**: `.next`
6.  Click **Deploy**.

### Environment Variables
No specific environment variables are required for the public features (Polymarket Gamma API is public).
If you add private APIs later, set them in **Site Settings > Environment variables**.

## Project Structure
- `src/components/VeritasWidget.tsx`: Main UI component.
- `src/utils/market-aggregator.ts`: Logic to fetch/normalize data.
- `src/utils/geo.ts`: IP compliance logic.
- `public/embed.js`: Client-side script for iframe injection.

## License
MIT
