import TestConfiguration from "../TestConfiguration"
import { AccountAPI } from "./accounts"
import { AuthAPI } from "./auth"
import { ConfigAPI } from "./configs"
import { EmailAPI } from "./email"
import { SelfAPI } from "./self"
import { UserAPI } from "./users"

export default class API {
  accounts: AccountAPI
  auth: AuthAPI
  configs: ConfigAPI
  emails: EmailAPI
  self: SelfAPI
  users: UserAPI

  constructor(config: TestConfiguration) {
    this.accounts = new AccountAPI(config)
    this.auth = new AuthAPI(config)
    this.configs = new ConfigAPI(config)
    this.emails = new EmailAPI(config)
    this.self = new SelfAPI(config)
    this.users = new UserAPI(config)
  }
}
