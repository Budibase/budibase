import { Account, AccountMetadata } from "../../../documents"

export interface SaveAccountRequest extends Account {}
export interface SaveAccountResponse extends AccountMetadata {}
