export function init(opts: any): void;
export function dangerousGetDB(dbName: any, opts: any): any;
export function closeDB(db: any): Promise<any>;
export function doWithDB(dbName: any, cb: any, opts?: {}): Promise<any>;
export function allDbs(): any[];
