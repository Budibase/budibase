import type { webpack5 } from 'next/dist/compiled/webpack/webpack';
export declare function startedDevelopmentServer(appUrl: string, bindAddr: string): void;
declare type AmpStatus = {
    message: string;
    line: number;
    col: number;
    specUrl: string | null;
    code: string;
};
export declare type AmpPageStatus = {
    [page: string]: {
        errors: AmpStatus[];
        warnings: AmpStatus[];
    };
};
export declare function formatAmpMessages(amp: AmpPageStatus): string;
export declare function ampValidation(page: string, errors: AmpStatus[], warnings: AmpStatus[]): void;
export declare function watchCompilers(client: webpack5.Compiler, server: webpack5.Compiler, edgeServer: webpack5.Compiler): void;
export declare function reportTrigger(trigger: string): void;
export {};
