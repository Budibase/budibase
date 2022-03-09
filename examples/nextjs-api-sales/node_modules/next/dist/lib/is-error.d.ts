export interface NextError extends Error {
    type?: string;
    page?: string;
    code?: string | number;
    cancelled?: boolean;
}
export default function isError(err: unknown): err is NextError;
export declare function getProperError(err: unknown): Error;
