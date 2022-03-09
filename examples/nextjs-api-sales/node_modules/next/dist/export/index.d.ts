import { NextConfigComplete } from '../server/config-shared';
import { Span } from '../trace';
interface ExportOptions {
    outdir: string;
    silent?: boolean;
    threads?: number;
    pages?: string[];
    buildExport?: boolean;
    statusMessage?: string;
    exportPageWorker?: typeof import('./worker').default;
    endWorker?: () => Promise<void>;
}
export default function exportApp(dir: string, options: ExportOptions, span: Span, configuration?: NextConfigComplete): Promise<void>;
export {};
