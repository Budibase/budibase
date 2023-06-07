import { tmpdir } from "os"

process.env.SELF_HOSTED = "1"
process.env.NODE_ENV = "jest"
process.env.MULTI_TENANCY = "1"
// @ts-ignore
process.env.BUDIBASE_DIR = tmpdir("budibase-unittests")
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error"
process.env.MOCK_REDIS = "1"
process.env.PLATFORM_URL = "http://localhost:10000"
process.env.REDIS_PASSWORD = "budibase"
