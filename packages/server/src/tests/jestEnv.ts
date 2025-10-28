import { tmpdir } from "os"
import {
  Agent,
  MockAgent,
  setGlobalDispatcher,
  fetch as undiciFetch,
} from "undici"

process.env.SELF_HOSTED = "1"
process.env.NODE_ENV = "jest"
process.env.MULTI_TENANCY = "1"
process.env.APP_PORT = "0"
process.env.WORKER_PORT = "0"
// @ts-ignore
process.env.BUDIBASE_DIR = tmpdir("budibase-unittests")
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error"
process.env.MOCK_REDIS = "1"
process.env.PLATFORM_URL = "http://localhost:10000"
process.env.REDIS_PASSWORD = "budibase"
process.env.BUDIBASE_VERSION = "0.0.0+jest"
process.env.WORKER_URL = "http://localhost:10000"
process.env.COUCH_DB_PASSWORD = "budibase"
process.env.COUCH_DB_USER = "budibase"
process.env.JWT_SECRET = "jwtsecret"
process.env.MINIO_URL = "http://localhost"
process.env.MINIO_ACCESS_KEY = "budibase"
process.env.MINIO_SECRET_KEY = "budibase"
process.env.SYNC_MIGRATION_CHECKS_MS = "10"
process.env.SKIP_WORKSPACE_MIGRATIONS = "1"

let agent: MockAgent | null = null

// Don't eagerly install MockAgent - let tests control when they need it
// This allows nock and undici to coexist

export function installHttpMocking() {
  if (agent) {
    return agent
  }
  agent = new MockAgent()
  setGlobalDispatcher(agent)
  // Don't disable all connections - allow passthrough for URLs not mocked by undici
  // This lets nock handle its own URLs (like account portal)
  agent.enableNetConnect()
  // Ensure the OpenAI SDK uses undici's fetch bound to our MockAgent dispatcher.
  ;(globalThis as any).fetch = undiciFetch as any
  return agent
}

export async function resetHttpMocking() {
  if (agent) {
    await agent.close()
  }
  // restore a real dispatcher so other tests (if any) aren’t polluted
  setGlobalDispatcher(new Agent())
  agent = null
}

export function getPool(origin: string) {
  if (!agent) {
    // Auto-install MockAgent when first pool is requested
    installHttpMocking()
  }
  return agent!.get(origin)
}
