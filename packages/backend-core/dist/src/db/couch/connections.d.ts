export declare const getCouchInfo: () => {
    url: string;
    auth: {
        username: string | undefined;
        password: string | undefined;
    };
    cookie: string;
};
export declare const getUrlInfo: (url?: string) => {
    url: string | undefined;
    auth: {
        username: string | undefined;
        password: string | undefined;
    };
};
