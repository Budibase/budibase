import type { webpack5 as webpack } from 'next/dist/compiled/webpack/webpack';
declare type Feature = 'next/image' | 'next/script' | 'next/dynamic' | 'swcLoader' | 'swcMinify' | 'swcRelay' | 'swcStyledComponents' | 'swcReactRemoveProperties' | 'swcExperimentalDecorators' | 'swcRemoveConsole' | 'swcImportSource';
interface FeatureUsage {
    featureName: Feature;
    invocationCount: number;
}
/**
 * Plugin that queries the ModuleGraph to look for modules that correspond to
 * certain features (e.g. next/image and next/script) and record how many times
 * they are imported.
 */
export declare class TelemetryPlugin implements webpack.WebpackPluginInstance {
    private usageTracker;
    constructor(buildFeaturesMap: Map<Feature, boolean>);
    apply(compiler: webpack.Compiler): void;
    usages(): FeatureUsage[];
}
export {};
