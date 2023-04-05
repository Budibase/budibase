import { AccountInternalAPI } from "../account-api"
import * as fixtures from "../internal-api/fixtures"
import { BudibaseInternalAPI } from "../internal-api"
import { DEFAULT_TENANT_ID, logging } from "@budibase/backend-core"
import { CreateAccountRequest } from "@budibase/types"
import env from "../environment"
import { APIRequestOpts } from "../types"

// turn off or on context logging i.e. tenantId, appId etc
// it's not applicable for the qa run
logging.LOG_CONTEXT = false

const accountsApi = new AccountInternalAPI({})
const internalApi = new BudibaseInternalAPI({})

const API_OPTS: APIRequestOpts = { doExpect: false }

// @ts-ignore
global.qa = {}

async function createAccount() {
  const account = fixtures.accounts.generateAccount()
  await accountsApi.accounts.validateEmail(account.email, API_OPTS)
  await accountsApi.accounts.validateTenantId(account.tenantId, API_OPTS)
  await accountsApi.accounts.create(account, API_OPTS)
  return account
}

async function loginAsAdmin() {
  const username = env.BB_ADMIN_USER_EMAIL!
  const password = env.BB_ADMIN_USER_PASSWORD!
  const tenantId = DEFAULT_TENANT_ID
  const [res, cookie] = await internalApi.auth.login(
    tenantId,
    username,
    password,
    API_OPTS
  )

  // @ts-ignore
  global.qa.authCookie = cookie
}

async function loginAsAccount(account: CreateAccountRequest) {
  const [res, cookie] = await internalApi.auth.login(
    account.tenantId,
    account.email,
    account.password,
    API_OPTS
  )

  // @ts-ignore
  global.qa.authCookie = cookie
}

async function setup() {
  console.log("\nGLOBAL SETUP STARTING")
  const env = await internalApi.environment.getEnvironment(API_OPTS)

  console.log(`Environment: ${JSON.stringify(env)}`)

  if (env.multiTenancy) {
    const account = await createAccount()
    // @ts-ignore
    global.qa.tenantId = account.tenantId
    await loginAsAccount(account)
  } else {
    // @ts-ignore
    global.qa.tenantId = DEFAULT_TENANT_ID
    await loginAsAdmin()
  }

  // @ts-ignore
  console.log(`Tenant: ${global.qa.tenantId}`)
  console.log("GLOBAL SETUP COMPLETE")
}

export default setup
