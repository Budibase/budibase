export declare enum DiagnosticCategory {
    Warning = 0,
    Error = 1,
    Suggestion = 2,
    Message = 3
}
export declare function getFormattedDiagnostic(ts: typeof import('typescript'), baseDir: string, diagnostic: import('typescript').Diagnostic): Promise<string>;
