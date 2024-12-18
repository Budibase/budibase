import { Document } from "../document";
export declare enum PluginType {
    DATASOURCE = "datasource",
    COMPONENT = "component",
    AUTOMATION = "automation"
}
export declare enum PluginSource {
    NPM = "NPM",
    GITHUB = "Github",
    URL = "URL",
    FILE = "File Upload"
}
export interface KoaFile {
    path: string | null;
    name: string | null;
}
export interface Plugin extends Document {
    description: string;
    name: string;
    version: string;
    source: PluginSource;
    package: {
        [key: string]: any;
    };
    hash: string;
    schema: {
        type: PluginType;
        [key: string]: any;
    };
    iconFileName?: string;
    jsUrl?: string;
    iconUrl?: string;
}
export declare const PLUGIN_TYPE_ARR: PluginType[];
