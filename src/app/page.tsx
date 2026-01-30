
'use client';

import React, { useState } from 'react';
import VeritasWidget from "@/components/VeritasWidget";
import { Copy, Check, Terminal, ExternalLink, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Content for Simulation
const CONTEXTS = {
  finance: {
    id: 'finance',
    name: 'Finance News',
    title: 'Fed Rate Decision Looming',
    body: 'The Federal Reserve is expected to make a key decision on interest rates next week. Analysts are split on whether rates will be cut or held steady. Markets have been volatile in anticipation.',
    keyword: 'Fed',
    gradient: 'from-blue-600 to-indigo-700'
  },
  crypto: {
    id: 'crypto',
    name: 'Crypto Blog',
    title: 'Bitcoin Smashes All-Time Highs',
    body: 'BTC continues its parabolic run as institutional adoption accelerates. With the halving approaching, miners are positioning for a supply shock.',
    keyword: 'Bitcoin',
    gradient: 'from-orange-500 to-amber-600'
  },
  politics: {
    id: 'politics',
    name: 'Election Watch',
    title: 'Primary Season Heats Up',
    body: 'Candidates are crisscrossing the early states as Super Tuesday approaches. Polls show a tightening race in key battlegrounds.',
    keyword: 'Election',
    gradient: 'from-red-600 to-blue-600'
  },
  sports: {
    id: 'sports',
    name: 'Sports Updates',
    title: 'Super Bowl Predictions',
    body: 'The Kansas City Chiefs are looking to defend their title against a surging NFC contender. Injuries could play a major role in the outcome.',
    keyword: 'Super Bowl',
    gradient: 'from-green-600 to-emerald-700'
  }
};

type ContextKey = keyof typeof CONTEXTS;


export default function Home() {
  const [activeContext, setActiveContext] = useState<ContextKey>('finance');
  const [copied, setCopied] = useState(false);

  const current = CONTEXTS[activeContext];

  const handleCopy = () => {
    const code = `<script src="https://merry-pothos-f8368d.netlify.app/embed.js"></script>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 flex flex-col md:flex-row">

      {/* LEFT: Simulation Controls (Dashboard) */}
      <aside className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col h-auto md:h-screen sticky top-0 z-10 shadow-xl">
        <div className="mb-8">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Terminal className="w-6 h-6 text-blue-600" />
            Veritas Link <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Beta</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Context-aware prediction market widget. Simulate different environments below.
          </p>
        </div>

        {/* Context Switcher */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Simulate Context</h3>
          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(CONTEXTS) as ContextKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveContext(key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left border ${activeContext === key
                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300 shadow-sm'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-tr ${CONTEXTS[key].gradient}`} />
                <span className="text-sm font-medium">{CONTEXTS[key].name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Embed Generator */}
        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Integration code</h3>
          <div className="bg-gray-900 rounded-lg p-4 relative group">
            <code className="text-xs text-green-400 font-mono break-all block pr-8">
              &lt;script src="https://merry-pothos-f8368d.netlify.app/embed.js"&gt;&lt;/script&gt;
            </code>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">
            Paste this snippet into any website. It will automatically detect page context.
          </p>
        </div>
      </aside>

      {/* RIGHT: Live Preview (The "Fake" Website) */}
      <main className="flex-1 p-8 md:p-12 lg:p-20 overflow-y-auto bg-dot-pattern relative">
        {/* Background Decoration */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            {/* Fake Site Header */}
            <div className={`h-2 w-24 rounded-full bg-gradient-to-r ${current.gradient} mb-6`} />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{current.name} • Live Preview</span>

            <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 leading-tight text-gray-900 dark:text-white">
              {current.title}
            </h1>

            <article className="prose dark:prose-invert lg:prose-lg max-w-none text-gray-600 dark:text-gray-300">
              <p className="lead">{current.body}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="my-8 p-4 bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 text-sm italic">
                Editor's Note: This is an auto-generated preview to demonstrate how Veritas Link adapts to different content.
              </div>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident.
              </p>
            </article>
          </motion.div>

          {/* The Widget */}
          <div className="flex justify-center md:justify-end mt-12 mb-20">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
              <VeritasWidget forcedContext={current.keyword} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
