import { Document } from "../document";
import { SourceName } from "../../sdk";
import { Table } from "./table";
export interface Datasource extends Document {
    type: string;
    name?: string;
    source: SourceName;
    auth?: {
        type: string;
    };
    config?: Record<string, any>;
    plus?: boolean;
    isSQL?: boolean;
    entities?: Record<string, Table>;
}
export declare enum RestAuthType {
    BASIC = "basic",
    BEARER = "bearer"
}
export interface RestBasicAuthConfig {
    username: string;
    password: string;
}
export interface RestBearerAuthConfig {
    token: string;
}
export interface RestAuthConfig {
    _id: string;
    name: string;
    type: RestAuthType;
    config: RestBasicAuthConfig | RestBearerAuthConfig;
}
export interface DynamicVariable {
    name: string;
    queryId: string;
    value: string;
}
export interface RestConfig {
    url: string;
    rejectUnauthorized?: boolean;
    downloadImages?: boolean;
    defaultHeaders?: {
        [key: string]: any;
    };
    legacyHttpParser?: boolean;
    authConfigs?: RestAuthConfig[];
    staticVariables?: {
        [key: string]: string;
    };
    dynamicVariables?: DynamicVariable[];
}
