import { Account, AccountMetadata } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class AccountAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  saveMetadata = async (account: Account) => {
    const res = await this.request
      .put(`/api/system/accounts/${account.accountId}/metadata`)
      .send(account)
      .set(this.config.internalAPIHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return res.body as AccountMetadata
  }

  destroyMetadata = (accountId: string) => {
    return this.request
      .del(`/api/system/accounts/${accountId}/metadata`)
      .set(this.config.internalAPIHeaders())
  }
}
