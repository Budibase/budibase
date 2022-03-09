/// <reference types="lru-cache" />
import type { CacheFs } from '../shared/lib/utils';
import LRUCache from 'next/dist/compiled/lru-cache';
import { PrerenderManifest } from '../build';
import { IncrementalCacheValue, IncrementalCacheEntry } from './response-cache';
export declare class IncrementalCache {
    incrementalOptions: {
        flushToDisk?: boolean;
        pagesDir?: string;
        distDir?: string;
        dev?: boolean;
    };
    prerenderManifest: PrerenderManifest;
    cache?: LRUCache<string, IncrementalCacheEntry>;
    locales?: string[];
    fs: CacheFs;
    constructor({ fs, max, dev, distDir, pagesDir, flushToDisk, locales, getPrerenderManifest, }: {
        fs: CacheFs;
        dev: boolean;
        max?: number;
        distDir: string;
        pagesDir: string;
        flushToDisk?: boolean;
        locales?: string[];
        getPrerenderManifest: () => PrerenderManifest;
    });
    private getSeedPath;
    private calculateRevalidate;
    getFallback(page: string): Promise<string>;
    get(pathname: string): Promise<IncrementalCacheEntry | null>;
    set(pathname: string, data: IncrementalCacheValue | null, revalidateSeconds?: number | false): Promise<void>;
}
