import { AccountInternalAPI } from "../account-api"
import { BudibaseInternalAPI } from "../internal-api"
import { APIRequestOpts } from "../types"

const accountsApi = new AccountInternalAPI({})
const internalApi = new BudibaseInternalAPI({})

const API_OPTS: APIRequestOpts = { doExpect: false }

async function deleteAccount() {
  // @ts-ignore
  const accountID = global.qa.accountId

  const [response] = await accountsApi.accounts.delete(accountID, {
    doExpect: false,
  })
  if (response.status !== 204) {
    throw new Error(`status: ${response.status} not equal to expected: 201`)
  }
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
