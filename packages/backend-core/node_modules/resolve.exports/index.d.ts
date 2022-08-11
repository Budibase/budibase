export type Options = {
	browser?: boolean;
	conditions?: string[];
	require?: boolean;
	unsafe?: false;
} | {
	conditions?: string[];
	unsafe?: true;
}

export function resolve<T=any>(pkg: T, entry: string, options?: Options): string | void;

export type BrowserFiles = Record<string, string | false>;

export function legacy<T=any>(pkg: T, options: { browser: true, fields?: string[] }): BrowserFiles | string | void;
export function legacy<T=any>(pkg: T, options: { browser: string, fields?: string[] }): string | false | void;
export function legacy<T=any>(pkg: T, options: { browser: false, fields?: string[] }): string | void;
export function legacy<T=any>(pkg: T, options?: {
	browser?: boolean | string;
	fields?: string[];
}): BrowserFiles | string | false | void;
