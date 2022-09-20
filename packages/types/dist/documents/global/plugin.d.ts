import { Document } from "../document";
export declare enum PluginType {
    DATASOURCE = "datasource",
    COMPONENT = "component"
}
export declare enum PluginSource {
    NPM = "NPM",
    GITHUB = "Github",
    URL = "URL",
    FILE = "File Upload"
}
export interface FileType {
    path: string;
    name: string;
}
export interface Plugin extends Document {
    description: string;
    name: string;
    version: string;
    jsUrl?: string;
    source: PluginSource;
    package: {
        [key: string]: any;
    };
    hash: string;
    schema: {
        type: PluginType;
        [key: string]: any;
    };
}
export declare const PLUGIN_TYPE_ARR: PluginType[];
