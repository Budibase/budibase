import { Account, AccountSSOProvider } from "../../documents";
import { Hosting } from "../../sdk";
export interface CreateAccountRequest {
    email: string;
    tenantId: string;
    hosting: Hosting;
    size: string;
    profession: string;
    tenantName?: string;
    name?: string;
    password: string;
    provider?: AccountSSOProvider;
}
export interface SearchAccountsRequest {
    email?: string;
    tenantId?: string;
}
export type SearchAccountsResponse = Account[];
