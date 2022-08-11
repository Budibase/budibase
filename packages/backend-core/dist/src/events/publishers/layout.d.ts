import { Layout } from "@budibase/types";
export declare function created(layout: Layout, timestamp?: string | number): Promise<void>;
export declare function deleted(layoutId: string): Promise<void>;
