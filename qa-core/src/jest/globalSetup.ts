import { DEFAULT_TENANT_ID } from "@budibase/backend-core"
import { AccountInternalAPI } from "../account-api"
import * as fixtures from "../internal-api/fixtures"
import { BudibaseInternalAPI } from "../internal-api"
import { Account, CreateAccountRequest, Feature } from "@budibase/types"
import env from "../environment"
import { APIRequestOpts } from "../types"

const accountsApi = new AccountInternalAPI({})
const internalApi = new BudibaseInternalAPI({})

const API_OPTS: APIRequestOpts = { doExpect: false }

// @ts-ignore
global.qa = {}

async function createAccount(): Promise<[CreateAccountRequest, Account]> {
  const account = fixtures.accounts.generateAccount()
  await accountsApi.accounts.validateEmail(account.email, API_OPTS)
  await accountsApi.accounts.validateTenantId(account.tenantId, API_OPTS)
  const [res, newAccount] = await accountsApi.accounts.create(account, {
    ...API_OPTS,
    autoVerify: true,
  })
  await updateLicense(newAccount.accountId)
  return [account, newAccount]
}

const UNLIMITED = { value: -1 }

async function updateLicense(accountId: string) {
  const [response] = await accountsApi.licenses.updateLicense(
    accountId,
    {
      overrides: {
        // add all features
        features: Object.values(Feature),
        quotas: {
          usage: {
            monthly: {
              automations: UNLIMITED,
            },
            static: {
              rows: UNLIMITED,
              users: UNLIMITED,
              userGroups: UNLIMITED,
              plugins: UNLIMITED,
            },
          },
        },
      },
    },
    { doExpect: false }
  )
  if (response.status !== 200) {
    throw new Error(
      `Could not update license for accountId=${accountId}: ${response.status}`
    )
  }
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
  const [res, cookie] = await accountsApi.auth.login(
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
    const [account, newAccount] = await createAccount()
    // @ts-ignore
    global.qa.tenantId = account.tenantId
    // @ts-ignore
    global.qa.email = account.email
    // @ts-ignore
    global.qa.accountId = newAccount.accountId
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
