import Client from "../redis";
import utils from "../redis/utils";
declare const _default: {
    Client: {
        new (db: string, selectDb?: number | null): Client;
    };
    utils: typeof utils;
    clients: {
        getUserClient: () => Promise<any>;
        getSessionClient: () => Promise<any>;
        getAppClient: () => Promise<any>;
        getCacheClient: () => Promise<any>;
        getWritethroughClient: () => Promise<any>;
        getMigrationsRedlock: () => Promise<any>;
    };
};
export = _default;
