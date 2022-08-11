"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFINITIONS = void 0;
const types_1 = require("@budibase/types");
exports.DEFINITIONS = [
    {
        type: types_1.MigrationType.GLOBAL,
        name: types_1.MigrationName.USER_EMAIL_VIEW_CASING,
    },
    {
        type: types_1.MigrationType.GLOBAL,
        name: types_1.MigrationName.QUOTAS_1,
    },
    {
        type: types_1.MigrationType.APP,
        name: types_1.MigrationName.APP_URLS,
    },
    {
        type: types_1.MigrationType.GLOBAL,
        name: types_1.MigrationName.DEVELOPER_QUOTA,
    },
    {
        type: types_1.MigrationType.GLOBAL,
        name: types_1.MigrationName.PUBLISHED_APP_QUOTA,
    },
    {
        type: types_1.MigrationType.APP,
        name: types_1.MigrationName.EVENT_APP_BACKFILL,
    },
    {
        type: types_1.MigrationType.GLOBAL,
        name: types_1.MigrationName.EVENT_GLOBAL_BACKFILL,
    },
    {
        type: types_1.MigrationType.INSTALLATION,
        name: types_1.MigrationName.EVENT_INSTALLATION_BACKFILL,
    },
    {
        type: types_1.MigrationType.GLOBAL,
        name: types_1.MigrationName.GLOBAL_INFO_SYNC_USERS,
    },
];
//# sourceMappingURL=definitions.js.map