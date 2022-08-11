import { ViewNames } from "./constants";
export * from "./constants";
export * from "./conversions";
export { default as Replication } from "./Replication";
/**
 * Generates a new app ID.
 * @returns {string} The new app ID which the app doc can be stored under.
 */
export declare const generateAppID: (tenantId?: null) => string;
/**
 * If creating DB allDocs/query params with only a single top level ID this can be used, this
 * is usually the case as most of our docs are top level e.g. tables, automations, users and so on.
 * More complex cases such as link docs and rows which have multiple levels of IDs that their
 * ID consists of need their own functions to build the allDocs parameters.
 * @param {string} docType The type of document which input params are being built for, e.g. user,
 * link, app, table and so on.
 * @param {string|null} docId The ID of the document minus its type - this is only needed if looking
 * for a singular document.
 * @param {object} otherProps Add any other properties onto the request, e.g. include_docs.
 * @returns {object} Parameters which can then be used with an allDocs request.
 */
export declare function getDocParams(docType: any, docId?: any, otherProps?: any): any;
/**
 * Retrieve the correct index for a view based on default design DB.
 */
export declare function getQueryIndex(viewName: ViewNames): string;
/**
 * Generates a new workspace ID.
 * @returns {string} The new workspace ID which the workspace doc can be stored under.
 */
export declare function generateWorkspaceID(): string;
/**
 * Gets parameters for retrieving workspaces.
 */
export declare function getWorkspaceParams(id?: string, otherProps?: {}): {
    startkey: string;
    endkey: string;
};
/**
 * Generates a new global user ID.
 * @returns {string} The new user ID which the user doc can be stored under.
 */
export declare function generateGlobalUserID(id?: any): string;
/**
 * Gets parameters for retrieving users.
 */
export declare function getGlobalUserParams(globalId: any, otherProps?: any): any;
export declare function getUsersByAppParams(appId: any, otherProps?: any): any;
/**
 * Generates a template ID.
 * @param ownerId The owner/user of the template, this could be global or a workspace level.
 */
export declare function generateTemplateID(ownerId: any): string;
export declare function generateAppUserID(prodAppId: string, userId: string): string;
/**
 * Gets parameters for retrieving templates. Owner ID must be specified, either global or a workspace level.
 */
export declare function getTemplateParams(ownerId: any, templateId: any, otherProps?: {}): {
    startkey: any;
    endkey: string;
};
/**
 * Generates a new role ID.
 * @returns {string} The new role ID which the role doc can be stored under.
 */
export declare function generateRoleID(id: any): string;
/**
 * Gets parameters for retrieving a role, this is a utility function for the getDocParams function.
 */
export declare function getRoleParams(roleId?: null, otherProps?: {}): any;
export declare function getStartEndKeyURL(base: any, baseKey: any, tenantId?: null): string;
/**
 * if in production this will use the CouchDB _all_dbs call to retrieve a list of databases. If testing
 * when using Pouch it will use the pouchdb-all-dbs package.
 * opts.efficient can be provided to make sure this call is always quick in a multi-tenant environment,
 * but it may not be 100% accurate in full efficiency mode (some tenantless apps may be missed).
 */
export declare function getAllDbs(opts?: {
    efficient: boolean;
}): Promise<any[]>;
/**
 * Lots of different points in the system need to find the full list of apps, this will
 * enumerate the entire CouchDB cluster and get the list of databases (every app).
 *
 * @return {Promise<object[]>} returns the app information document stored in each app database.
 */
export declare function getAllApps({ dev, all, idsOnly, efficient }?: any): Promise<any[]>;
/**
 * Utility function for getAllApps but filters to production apps only.
 */
export declare function getProdAppIDs(): Promise<any[]>;
/**
 * Utility function for the inverse of above.
 */
export declare function getDevAppIDs(): Promise<any[]>;
export declare function dbExists(dbName: any): Promise<any>;
/**
 * Generates a new configuration ID.
 * @returns {string} The new configuration ID which the config doc can be stored under.
 */
export declare const generateConfigID: ({ type, workspace, user }: any) => string;
/**
 * Gets parameters for retrieving configurations.
 */
export declare const getConfigParams: ({ type, workspace, user }: any, otherProps?: {}) => {
    startkey: string;
    endkey: string;
};
/**
 * Generates a new dev info document ID - this is scoped to a user.
 * @returns {string} The new dev info ID which info for dev (like api key) can be stored under.
 */
export declare const generateDevInfoID: (userId: any) => string;
/**
 * Returns the most granular configuration document from the DB based on the type, workspace and userID passed.
 * @param {Object} db - db instance to query
 * @param {Object} scopes - the type, workspace and userID scopes of the configuration.
 * @returns The most granular configuration document based on the scope.
 */
export declare const getScopedFullConfig: (db: any, { type, user, workspace }: any) => Promise<any>;
export declare const getPlatformUrl: (opts?: {
    tenantAware: boolean;
}) => Promise<string>;
export declare function pagination(data: any[], pageSize: number, { paginate, property, getKey, }?: {
    paginate: boolean;
    property: string;
    getKey?: (doc: any) => string | undefined;
}): {
    data: any[];
    hasNextPage: boolean;
    nextPage?: undefined;
} | {
    data: any[];
    hasNextPage: boolean;
    nextPage: string | undefined;
};
export declare function getScopedConfig(db: any, params: any): Promise<any>;
