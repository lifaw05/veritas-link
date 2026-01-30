'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertCircle, ShieldCheck, Loader2, ExternalLink } from 'lucide-react';
import { useContextScraper } from '@/hooks/useContextScraper';
import { checkComplianceAsync, ComplianceResult } from '@/utils/geo';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Market {
    id: string;
    question: string;
    probability: number;
    source: string;
    url: string;
    image?: string;
    volume?: number;
}


interface VeritasWidgetProps {
    forcedContext?: string;
}

export default function VeritasWidget({ forcedContext }: VeritasWidgetProps = {}) {
    const scrapedContext = useContextScraper();
    // Prioritize forcedContext (from props) -> then scrapedContext (from hook)
    const contextKeyword = forcedContext || scrapedContext;

    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Compliance State
    const [compliance, setCompliance] = useState<ComplianceResult>({ allowed: true, region: '' });
    const [geoLoading, setGeoLoading] = useState(true);

    // Initial Geo Check
    useEffect(() => {
        async function runGeoCheck() {
            setGeoLoading(true);
            const result = await checkComplianceAsync();
            setCompliance(result);
            setGeoLoading(false);
        }
        runGeoCheck();
    }, []);

    // Load Markets based on context
    useEffect(() => {
        async function loadMarkets() {
            if (!contextKeyword) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/markets?keyword=${encodeURIComponent(contextKeyword)}`);
                const data = await res.json();
                if (data.markets) setMarkets(data.markets);
            } catch (e) {
                console.error("Failed to load markets", e);
            } finally {
                setLoading(false);
            }
        }
        loadMarkets();
    }, [contextKeyword]);

    const isAllowed = compliance.allowed;
    const region = compliance.region || 'Unknown';
    const reason = compliance.reason;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={twMerge(
                "w-full max-w-sm overflow-hidden font-sans border border-white/20 shadow-2xl rounded-2xl",
                "bg-white/70 dark:bg-black/60 backdrop-blur-md" // Glassmorphism
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 dark:border-white/5">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-sm font-bold tracking-wide uppercase text-gray-900 dark:text-gray-100">
                        Veritas Link
                    </h2>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className={clsx("w-2 h-2 rounded-full animate-pulse", isAllowed ? "bg-emerald-500" : "bg-red-500")} />
                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {isAllowed ? 'Live' : 'Restricted'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {!isAllowed ? (
                    <div className="p-3 text-xs text-red-600 bg-red-50/50 dark:bg-red-900/20 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{reason || `Region Restricted: ${region}`}</span>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5" />
                                Context: <span className="text-gray-900 dark:text-gray-200">{contextKeyword || 'Scanning...'}</span>
                            </span>
                        </div>

                        {loading || geoLoading ? (
                            <div className="flex flex-col items-center justify-center py-8 space-y-3">
                                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                <span className="text-xs text-gray-400">
                                    {geoLoading ? 'Checking Region...' : 'Analyzing markets...'}
                                </span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {markets.length === 0 ? (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-xs text-center text-gray-500 py-4"
                                        >
                                            No active markets found for this context.
                                        </motion.p>
                                    ) : (
                                        markets.slice(0, 3).map((m, i) => (
                                            <MarketCard key={m.id} market={m} index={i} />
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 bg-gray-50/50 dark:bg-white/5 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] text-gray-400">Powered by Polymarket</span>
            </div>
        </motion.div>
    );
}

function MarketCard({ market, index }: { market: Market; index: number }) {
    // Advanced Feature: Whale Alert
    // Threshold: $10,000 volume or arbitrarily high for demo if real volume is low
    const isWhale = (market.volume && market.volume > 10000);

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative block p-4 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 border border-transparent hover:border-blue-500/30 rounded-xl transition-all duration-200"
        >
            <div className="flex items-start gap-3">
                {market.image ? (
                    <img src={market.image} alt="Market Icon" className="w-10 h-10 rounded-full shadow-sm object-cover bg-white" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                        ?
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {market.question}
                    </p>

                    {/* Advanced Feature: Whale Alert & Volume */}
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-[9px]">
                            Polymarket
                        </span>
                        {isWhale && (
                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                                🐳 Whale Alert
                            </span>
                        )}
                    </div>
                </div>

                {/* Advanced Feature: Truth Meter (Probability + Gauge) */}
                <div className="flex flex-col items-end gap-1">
                    <span className={clsx(
                        "text-lg font-bold",
                        market.probability > 50 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-300"
                    )}>
                        {market.probability}%
                    </span>
                    <TruthMeter probability={market.probability} />
                </div>
            </div>

            {/* Advanced Feature: Hedge/Trade CTA */}
            <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="text-[10px] text-gray-400">
                    {market.volume ? `Vol: $${market.volume.toLocaleString()}` : 'Vol: --'}
                </div>
                <a
                    href={market.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Trade on Polymarket <ExternalLink className="w-3 h-3" />
                </a>
            </div>

            {/* Background Progress Bar (Subtle) */}
            <div className="absolute bottom-0 left-0 h-[3px] bg-blue-500/10 w-full rounded-b-xl overflow-hidden">
                <div
                    className="h-full bg-blue-500/50"
                    style={{ width: `${market.probability}%` }}
                />
            </div>
        </motion.div>
    );
}

function TruthMeter({ probability }: { probability: number }) {
    let label = "Uncertain";
    let color = "bg-gray-200";

    if (probability <= 20) { label = "Highly Unlikely"; color = "bg-red-400"; }
    else if (probability <= 40) { label = "Unlikely"; color = "bg-orange-400"; }
    else if (probability <= 60) { label = "Uncertain"; color = "bg-yellow-400"; }
    else if (probability <= 80) { label = "Likely"; color = "bg-lime-400"; }
    else { label = "Consensus"; color = "bg-emerald-500"; }

    return (
        <div className="flex flex-col items-end">
            <span className="text-[9px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</span>
            <div className="flex gap-0.5">
                {[20, 40, 60, 80, 100].map((threshold) => (
                    <div
                        key={threshold}
                        className={clsx(
                            "w-1.5 h-1 rounded-sm",
                            probability >= (threshold - 19) ? color : "bg-gray-200 dark:bg-white/10"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
