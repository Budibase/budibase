export function getUrlInfo(url?: string): {
    url: string | undefined;
    auth: {
        username: string | undefined;
        password: string | undefined;
    };
};
export function getCouchInfo(): {
    url: string | undefined;
    auth: {
        username: string | undefined;
        password: string | undefined;
    };
    cookie: string;
};
export function getPouch(opts?: {}): new <Content extends {} = {}>(name?: string | undefined, options?: PouchDB.Configuration.DatabaseConfiguration | undefined) => PouchDB.Database<Content>;
