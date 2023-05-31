import { AccountInternalAPI } from "../account-api"
import { BudibaseInternalAPI } from "../internal-api"
import { APIRequestOpts } from "../types"

const accountsApi = new AccountInternalAPI({})
const internalApi = new BudibaseInternalAPI({})

const API_OPTS: APIRequestOpts = { doExpect: false }

async function deleteAccount() {
  // @ts-ignore
  const accountID = global.qa.accountId
  await accountsApi.accounts.delete(accountID)
}

async function teardown() {
  console.log("\nGLOBAL TEARDOWN STARTING")
  const env = await internalApi.environment.getEnvironment(API_OPTS)
  if (env.multiTenancy) {
    await deleteAccount()
  }

  console.log("GLOBAL TEARDOWN COMPLETE")
}

export default teardown
