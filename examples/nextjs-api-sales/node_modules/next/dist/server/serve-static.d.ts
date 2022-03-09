/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
export declare function serveStatic(req: IncomingMessage, res: ServerResponse, path: string): Promise<void>;
export declare function getContentType(extWithoutDot: string): string | null;
export declare function getExtension(contentType: string): string | null;
