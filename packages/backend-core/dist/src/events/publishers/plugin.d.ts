import { Plugin } from "@budibase/types";
export declare function init(plugin: Plugin): Promise<void>;
export declare function imported(plugin: Plugin): Promise<void>;
export declare function deleted(plugin: Plugin): Promise<void>;
