import { Migration, MigrationOptions, MigrationNoOpOptions } from "@budibase/types";
export declare const getMigrationsDoc: (db: any) => Promise<any>;
export declare const backPopulateMigrations: (opts: MigrationNoOpOptions) => Promise<void>;
export declare const runMigration: (migration: Migration, options?: MigrationOptions) => Promise<void>;
export declare const runMigrations: (migrations: Migration[], options?: MigrationOptions) => Promise<void>;
