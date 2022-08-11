import { Account } from "@budibase/types";
export declare function created(account: Account): Promise<void>;
export declare function deleted(account: Account): Promise<void>;
export declare function verified(account: Account): Promise<void>;
