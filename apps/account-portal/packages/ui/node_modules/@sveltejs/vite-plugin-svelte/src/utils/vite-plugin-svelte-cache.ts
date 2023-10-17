import { SvelteRequest } from './id';
import { Code, CompileData } from './compile';

export class VitePluginSvelteCache {
	private _css = new Map<string, Code>();
	private _js = new Map<string, Code>();
	private _dependencies = new Map<string, string[]>();
	private _dependants = new Map<string, Set<string>>();
	private _resolvedSvelteFields = new Map<string, string>();
	private _errors = new Map<string, any>();

	public update(compileData: CompileData) {
		this._errors.delete(compileData.normalizedFilename);
		this.updateCSS(compileData);
		this.updateJS(compileData);
		this.updateDependencies(compileData);
	}

	public has(svelteRequest: SvelteRequest) {
		const id = svelteRequest.normalizedFilename;
		return this._errors.has(id) || this._js.has(id) || this._css.has(id);
	}

	public setError(svelteRequest: SvelteRequest, error: any) {
		// keep dependency info, otherwise errors in dependants would not trigger an update after fixing
		// because they are no longer watched
		this.remove(svelteRequest, true);
		this._errors.set(svelteRequest.normalizedFilename, error);
	}

	private updateCSS(compileData: CompileData) {
		this._css.set(compileData.normalizedFilename, compileData.compiled.css);
	}

	private updateJS(compileData: CompileData) {
		if (!compileData.ssr) {
			// do not cache SSR js
			this._js.set(compileData.normalizedFilename, compileData.compiled.js);
		}
	}

	private updateDependencies(compileData: CompileData) {
		const id = compileData.normalizedFilename;
		const prevDependencies = this._dependencies.get(id) || [];
		const dependencies = compileData.dependencies;
		this._dependencies.set(id, dependencies);
		const removed = prevDependencies.filter((d) => !dependencies.includes(d));
		const added = dependencies.filter((d) => !prevDependencies.includes(d));
		added.forEach((d) => {
			if (!this._dependants.has(d)) {
				this._dependants.set(d, new Set<string>());
			}
			this._dependants.get(d)!.add(compileData.filename);
		});
		removed.forEach((d) => {
			this._dependants.get(d)!.delete(compileData.filename);
		});
	}

	public remove(svelteRequest: SvelteRequest, keepDependencies: boolean = false): boolean {
		const id = svelteRequest.normalizedFilename;
		let removed = false;
		if (this._errors.delete(id)) {
			removed = true;
		}
		if (this._js.delete(id)) {
			removed = true;
		}
		if (this._css.delete(id)) {
			removed = true;
		}
		if (!keepDependencies) {
			const dependencies = this._dependencies.get(id);
			if (dependencies) {
				removed = true;
				dependencies.forEach((d) => {
					const dependants = this._dependants.get(d);
					if (dependants && dependants.has(svelteRequest.filename)) {
						dependants.delete(svelteRequest.filename);
					}
				});
				this._dependencies.delete(id);
			}
		}

		return removed;
	}

	public getCSS(svelteRequest: SvelteRequest) {
		return this._css.get(svelteRequest.normalizedFilename);
	}

	public getJS(svelteRequest: SvelteRequest) {
		if (!svelteRequest.ssr) {
			// SSR js isn't cached
			return this._js.get(svelteRequest.normalizedFilename);
		}
	}

	public getError(svelteRequest: SvelteRequest) {
		return this._errors.get(svelteRequest.normalizedFilename);
	}

	public getDependants(path: string): string[] {
		const dependants = this._dependants.get(path);
		return dependants ? [...dependants] : [];
	}

	public getResolvedSvelteField(name: string, importer?: string): string | void {
		return this._resolvedSvelteFields.get(this._getResolvedSvelteFieldKey(name, importer));
	}

	public setResolvedSvelteField(
		importee: string,
		importer: string | undefined = undefined,
		resolvedSvelte: string
	) {
		this._resolvedSvelteFields.set(
			this._getResolvedSvelteFieldKey(importee, importer),
			resolvedSvelte
		);
	}

	private _getResolvedSvelteFieldKey(importee: string, importer?: string): string {
		return importer ? `${importer} > ${importee}` : importee;
	}
}
