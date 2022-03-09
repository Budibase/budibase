/// <reference types="node" />
import { IncomingMessage } from 'http';
export declare function detectLocaleCookie(req: IncomingMessage, locales: string[]): string | undefined;
