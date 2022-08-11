export = API;
declare class API {
    constructor(host: any);
    host: any;
    apiCall: (method: any) => (url?: string, options?: {}) => Promise<any>;
    post: (url?: string, options?: {}) => Promise<any>;
    get: (url?: string, options?: {}) => Promise<any>;
    patch: (url?: string, options?: {}) => Promise<any>;
    del: (url?: string, options?: {}) => Promise<any>;
    put: (url?: string, options?: {}) => Promise<any>;
}
