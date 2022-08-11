export namespace data {
    export { mockClientID as clientID };
    export { mockClientSecret as clientSecret };
    export { mockEmail as email };
    export { mockAccessToken as accessToken };
    export { mockRefreshToken as refreshToken };
    export { buildThirdPartyUser };
}
declare const mockClientID: "mockClientID";
declare const mockClientSecret: "mockClientSecret";
declare const mockEmail: "mock@budibase.com";
declare const mockAccessToken: "mockAccessToken";
declare const mockRefreshToken: "mockRefreshToken";
declare function buildThirdPartyUser(provider?: string, providerType?: string, profile?: {
    id: string;
    name: {
        givenName: string;
        familyName: string;
    };
    _json: {
        email: string;
    };
}, email?: string, oauth2?: {
    accessToken: string;
    refreshToken: string;
}): {
    provider: string;
    providerType: string;
    userId: string;
    profile: {
        id: string;
        name: {
            givenName: string;
            familyName: string;
        };
        _json: {
            email: string;
        };
    };
    email: string;
    oauth2: {
        accessToken: string;
        refreshToken: string;
    };
};
export {};
