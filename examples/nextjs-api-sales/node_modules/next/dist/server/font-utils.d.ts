export declare type FontManifest = Array<{
    url: string;
    content: string;
}>;
export declare function getFontDefinitionFromNetwork(url: string): Promise<string>;
export declare function getFontDefinitionFromManifest(url: string, manifest: FontManifest): string;
