declare type postProcessOptions = {
    optimizeFonts: boolean;
};
declare type renderOptions = {
    getFontDefinition?: (url: string) => string;
};
declare function processHTML(html: string, data: renderOptions, options: postProcessOptions): Promise<string>;
export default processHTML;
