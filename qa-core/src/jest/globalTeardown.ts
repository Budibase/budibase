import { AccountInternalAPI } from "../account-api"
import { BudibaseInternalAPI } from "../internal-api"
import { APIRequestOpts } from "../types"

const accountsApi = new AccountInternalAPI({})
const internalApi = new BudibaseInternalAPI({})

const API_OPTS: APIRequestOpts = { doExpect: false }

async function teardown() {
  console.log("\nGLOBAL SETUP STARTING")
  const env = await internalApi.environment.getEnvironment(API_OPTS)
  console.log("GLOBAL SETUP COMPLETE")
}

export default setup