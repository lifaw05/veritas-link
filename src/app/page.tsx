
import VeritasWidget from "@/components/VeritasWidget";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial News: Fed Rates Decision',
  description: 'Latest news on the Federal Reserve interest rate decision.',
};

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* 
        Simulating a page with specific content to trigger the Context Scraper.
        We'll verify functionality by changing the title/content.
      */}
      <header className="row-start-1 text-center">
        <h1 className="text-2xl font-bold mb-2">Financial News Daily</h1>
        <p className="text-sm text-gray-500">Breaking: Fed Interest Rate Decision Looming</p>
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <article className="prose dark:prose-invert max-w-2xl">
          <p>
            The Federal Reserve is expected to make a key decision on interest rates next week.
            Analysts are split on whether rates will be cut or held steady.
          </p>
          <p>
            Markets have been volatile in anticipation of the announcement.
          </p>
        </article>

        {/* The Widget */}
        <div className="mt-8">
          <VeritasWidget />
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Powered by V-Link
      </footer>
    </div>
  );
}
