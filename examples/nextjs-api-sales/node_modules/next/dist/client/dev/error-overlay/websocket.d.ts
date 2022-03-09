export declare function addMessageListener(cb: (event: any) => void): void;
export declare function sendMessage(data: any): void;
export declare function connectHMR(options: {
    path: string;
    assetPrefix: string;
    timeout: number;
    log?: boolean;
}): void;
