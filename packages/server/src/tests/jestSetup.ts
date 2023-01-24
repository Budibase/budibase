import env from "../environment"
import { env as coreEnv } from "@budibase/backend-core"

if (!process.env.DEBUG) {
  global.console.log = jest.fn() // console.log are ignored in tests
  global.console.warn = jest.fn() // console.warn are ignored in tests
}

if (!process.env.CI) {
  // set a longer timeout in dev for debugging
  // 100 seconds
  jest.setTimeout(100000)
}

function overrideConfigValue(key: string, value: string) {
  env._set(key, value)
  coreEnv._set(key, value)
}

const globalSafe = global as any

overrideConfigValue(
  "COUCH_DB_PORT",
  globalSafe.__TESTCONTAINERS_DEVENV_PORT_5984__
)
overrideConfigValue(
  "COUCH_DB_URL",
  `http://${globalSafe.__TESTCONTAINERS_DEVENV_IP__}:${globalSafe.__TESTCONTAINERS_DEVENV_PORT_5984__}`
)

overrideConfigValue(
  "MINIO_URL",
  `http://${globalSafe.__TESTCONTAINERS_DEVENV_IP__}:${globalSafe.__TESTCONTAINERS_DEVENV_PORT_9000__}`
)
