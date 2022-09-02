import { Account, AccountMetadata } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"

export class AccountAPI {
  config: TestConfiguration
  request: any

  constructor(config: TestConfiguration) {
    this.config = config
    this.request = config.request
  }

  saveMetadata = async (account: Account) => {
    const res = await this.request
      .put(`/api/system/accounts/${account.accountId}/metadata`)
      .send(account)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return res.body as AccountMetadata
  }

  destroyMetadata = (accountId: string) => {
    return this.request
      .del(`/api/system/accounts/${accountId}/metadata`)
      .set(this.config.defaultHeaders())
  }
}
