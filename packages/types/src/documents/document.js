"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualDocumentType = exports.InternalTable = exports.DocumentTypesToImport = exports.DocumentType = exports.prefixed = exports.UNICODE_MAX = exports.SEPARATOR = void 0;
exports.getDocumentType = getDocumentType;
exports.getVirtualDocumentType = getVirtualDocumentType;
exports.SEPARATOR = "_";
exports.UNICODE_MAX = "\ufff0";
const prefixed = (type) => `${type}${exports.SEPARATOR}`;
exports.prefixed = prefixed;
var DocumentType;
(function (DocumentType) {
    DocumentType["USER"] = "us";
    DocumentType["GROUP"] = "gr";
    DocumentType["WORKSPACE"] = "workspace";
    DocumentType["CONFIG"] = "config";
    DocumentType["TEMPLATE"] = "template";
    DocumentType["APP"] = "app";
    DocumentType["DEV"] = "dev";
    DocumentType["APP_DEV"] = "app_dev";
    DocumentType["APP_METADATA"] = "app_metadata";
    DocumentType["ROLE"] = "role";
    DocumentType["MIGRATIONS"] = "migrations";
    DocumentType["DEV_INFO"] = "devinfo";
    DocumentType["AUTOMATION_LOG"] = "log_au";
    DocumentType["ACCOUNT_METADATA"] = "acc_metadata";
    DocumentType["PLUGIN"] = "plg";
    DocumentType["DATASOURCE"] = "datasource";
    DocumentType["DATASOURCE_PLUS"] = "datasource_plus";
    DocumentType["APP_BACKUP"] = "backup";
    DocumentType["TABLE"] = "ta";
    DocumentType["ROW"] = "ro";
    DocumentType["AUTOMATION"] = "au";
    DocumentType["LINK"] = "li";
    DocumentType["WEBHOOK"] = "wh";
    DocumentType["INSTANCE"] = "inst";
    DocumentType["LAYOUT"] = "layout";
    DocumentType["SCREEN"] = "screen";
    DocumentType["QUERY"] = "query";
    DocumentType["DEPLOYMENTS"] = "deployments";
    DocumentType["METADATA"] = "metadata";
    DocumentType["MEM_VIEW"] = "view";
    DocumentType["USER_FLAG"] = "flag";
    DocumentType["AUTOMATION_METADATA"] = "meta_au";
    DocumentType["AUDIT_LOG"] = "al";
    DocumentType["APP_MIGRATION_METADATA"] = "_design/migrations";
    DocumentType["SCIM_LOG"] = "scimlog";
    DocumentType["ROW_ACTIONS"] = "ra";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
// Because DocumentTypes can overlap, we need to make sure that we search
// longest first to ensure we get the correct type.
const sortedDocumentTypes = Object.values(DocumentType).sort((a, b) => b.length - a.length // descending
);
function getDocumentType(id) {
    return sortedDocumentTypes.find(docType => id.startsWith(`${docType}${exports.SEPARATOR}`));
}
// these are the core documents that make up the data, design
// and automation sections of an app. This excludes any internal
// rows as we shouldn't import data.
exports.DocumentTypesToImport = [
    DocumentType.ROLE,
    DocumentType.DATASOURCE,
    DocumentType.DATASOURCE_PLUS,
    DocumentType.TABLE,
    DocumentType.AUTOMATION,
    DocumentType.WEBHOOK,
    DocumentType.SCREEN,
    DocumentType.QUERY,
    DocumentType.METADATA,
    DocumentType.MEM_VIEW,
    // Deprecated but still copied
    DocumentType.INSTANCE,
    DocumentType.LAYOUT,
];
var InternalTable;
(function (InternalTable) {
    InternalTable["USER_METADATA"] = "ta_users";
})(InternalTable || (exports.InternalTable = InternalTable = {}));
// these documents don't really exist, they are part of other
// documents or enriched into existence as part of get requests
var VirtualDocumentType;
(function (VirtualDocumentType) {
    VirtualDocumentType["VIEW"] = "view";
    VirtualDocumentType["ROW_ACTION"] = "row_action";
})(VirtualDocumentType || (exports.VirtualDocumentType = VirtualDocumentType = {}));
// Because VirtualDocumentTypes can overlap, we need to make sure that we search
// longest first to ensure we get the correct type.
const sortedVirtualDocumentTypes = Object.values(VirtualDocumentType).sort((a, b) => b.length - a.length // descending
);
function getVirtualDocumentType(id) {
    return sortedVirtualDocumentTypes.find(docType => id.startsWith(`${docType}${exports.SEPARATOR}`));
}
