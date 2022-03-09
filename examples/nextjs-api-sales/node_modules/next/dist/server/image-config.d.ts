export declare const VALID_LOADERS: readonly ["default", "imgix", "cloudinary", "akamai", "custom"];
export declare type LoaderValue = typeof VALID_LOADERS[number];
declare type ImageFormat = 'image/avif' | 'image/webp';
/**
 * Image configurations
 *
 * @see [Image configuration options](https://nextjs.org/docs/api-reference/next/image#configuration-options)
 */
export declare type ImageConfigComplete = {
    /** @see [Device sizes documentation](https://nextjs.org/docs/api-reference/next/image#device-sizes) */
    deviceSizes: number[];
    /** @see [Image sizing documentation](https://nextjs.org/docs/basic-features/image-optimization#image-sizing) */
    imageSizes: number[];
    /** @see [Image loaders configuration](https://nextjs.org/docs/basic-features/image-optimization#loaders) */
    loader: LoaderValue;
    /** @see [Image loader configuration](https://nextjs.org/docs/api-reference/next/image#loader-configuration) */
    path: string;
    /** @see [Image domains configuration](https://nextjs.org/docs/basic-features/image-optimization#domains) */
    domains: string[];
    /** @see [Cache behavior](https://nextjs.org/docs/api-reference/next/image#caching-behavior) */
    disableStaticImages: boolean;
    /** @see [Cache behavior](https://nextjs.org/docs/api-reference/next/image#caching-behavior) */
    minimumCacheTTL: number;
    /** @see [Acceptable formats](https://nextjs.org/docs/api-reference/next/image#acceptable-formats) */
    formats: ImageFormat[];
    /** @see [Dangerously Allow SVG](https://nextjs.org/docs/api-reference/next/image#dangerously-allow-svg) */
    dangerouslyAllowSVG: boolean;
    /** @see [Dangerously Allow SVG](https://nextjs.org/docs/api-reference/next/image#dangerously-allow-svg) */
    contentSecurityPolicy: string;
};
export declare type ImageConfig = Partial<ImageConfigComplete>;
export declare const imageConfigDefault: ImageConfigComplete;
export {};
