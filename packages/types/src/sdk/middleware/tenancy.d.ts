export interface GetTenantIdOptions {
    allowNoTenant?: boolean;
    excludeStrategies?: TenantResolutionStrategy[];
    includeStrategies?: TenantResolutionStrategy[];
}
export declare enum TenantResolutionStrategy {
    USER = "user",
    HEADER = "header",
    QUERY = "query",
    SUBDOMAIN = "subdomain",
    PATH = "path"
}
