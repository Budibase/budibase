import type { CreateTableInput as LegacyCreateTableInput } from "aws-sdk/clients/dynamodb";
export declare type TableConfig = LegacyCreateTableInput & {
    data?: Record<string, unknown>[];
    TableName: string;
};
export declare type Config = {
    tables?: TableConfig[] | (() => TableConfig[] | Promise<TableConfig[]>);
    basePort?: number;
};
