import { AccountInternalAPI } from "../account-api"
import * as fixtures from "../internal-api/fixtures"
import { BudibaseInternalAPI } from "../internal-api"
import { DEFAULT_TENANT_ID } from "@budibase/backend-core"
import { CreateAccountRequest } from "@budibase/types"

const accountsApi = new AccountInternalAPI({})
const internalApi = new BudibaseInternalAPI({})

let TENANT_ID: string
let AUTH_COOKIE: string

async function createAccount() {
  const accountsApi = new AccountInternalAPI({})
  const account = fixtures.accounts.generateAccount()
  await accountsApi.accounts.validateEmail(account.email)
  await accountsApi.accounts.validateTenantId(account.tenantId)
  await accountsApi.accounts.create(account)
  return account
}

async function loginAsAdmin() {
  const username = process.env.BB_ADMIN_USER_EMAIL!
  const password = process.env.BB_ADMIN_USER_PASSWORD!
  const tenantId = DEFAULT_TENANT_ID

  const [res, cookie] = await internalApi.auth.login(DEFAULT_TENANT_ID, username, password)
  AUTH_COOKIE = cookie
}

async function loginAsAccount(account: CreateAccountRequest) {
  const [res, cookie] = await internalApi.auth.login(account.tenantId, account.email, account.password)
  AUTH_COOKIE = cookie
}

async function setup() {
  const env = await internalApi.environment.getEnvironment()

  if (env.multiTenancy) {
    const account = await createAccount()
    TENANT_ID = account.tenantId
    await loginAsAccount(account)
  } else {
    TENANT_ID = DEFAULT_TENANT_ID
    await this.loginAsAdmin()
  }



  AUTH_COOKIE = cookie
}


export default setup