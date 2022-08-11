import { IdentityContext, User, Account } from "@budibase/types";
export declare const getIdentity: () => IdentityContext | undefined;
export declare const doInIdentityContext: (identity: IdentityContext, task: any) => Promise<any>;
export declare const doInUserContext: (user: User, task: any) => Promise<any>;
export declare const doInAccountContext: (account: Account, task: any) => Promise<any>;
export declare const getAccountUserId: (account: Account) => string;
