export declare const SEPARATOR = "_";
export declare const UNICODE_MAX = "\uFFF0";
export declare const prefixed: (type: DocumentType) => string;
export declare enum DocumentType {
    USER = "us",
    GROUP = "gr",
    WORKSPACE = "workspace",
    CONFIG = "config",
    TEMPLATE = "template",
    APP = "app",
    DEV = "dev",
    APP_DEV = "app_dev",
    APP_METADATA = "app_metadata",
    ROLE = "role",
    MIGRATIONS = "migrations",
    DEV_INFO = "devinfo",
    AUTOMATION_LOG = "log_au",
    ACCOUNT_METADATA = "acc_metadata",
    PLUGIN = "plg",
    DATASOURCE = "datasource",
    DATASOURCE_PLUS = "datasource_plus",
    APP_BACKUP = "backup",
    TABLE = "ta",
    ROW = "ro",
    AUTOMATION = "au",
    LINK = "li",
    WEBHOOK = "wh",
    INSTANCE = "inst",
    LAYOUT = "layout",
    SCREEN = "screen",
    QUERY = "query",
    DEPLOYMENTS = "deployments",
    METADATA = "metadata",
    MEM_VIEW = "view",
    USER_FLAG = "flag",
    AUTOMATION_METADATA = "meta_au",
    AUDIT_LOG = "al",
    APP_MIGRATION_METADATA = "_design/migrations",
    SCIM_LOG = "scimlog",
    ROW_ACTIONS = "ra"
}
export declare function getDocumentType(id: string): DocumentType | undefined;
export declare const DocumentTypesToImport: DocumentType[];
export declare enum InternalTable {
    USER_METADATA = "ta_users"
}
export declare enum VirtualDocumentType {
    VIEW = "view",
    ROW_ACTION = "row_action"
}
export declare function getVirtualDocumentType(id: string): VirtualDocumentType | undefined;
export interface Document {
    _id?: string;
    _rev?: string;
    createdAt?: string | number;
    updatedAt?: string;
}
export interface AnyDocument extends Document {
    [key: string]: any;
}
