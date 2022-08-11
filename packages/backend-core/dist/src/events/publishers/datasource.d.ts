import { Datasource } from "@budibase/types";
export declare function created(datasource: Datasource, timestamp?: string | number): Promise<void>;
export declare function updated(datasource: Datasource): Promise<void>;
export declare function deleted(datasource: Datasource): Promise<void>;
