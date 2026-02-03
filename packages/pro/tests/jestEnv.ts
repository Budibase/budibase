// need to run this first to allow for backend core import to work
process.env.JWT_SECRET = "test-jwtsecret"
process.env.MOCK_REDIS = "1"
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error"

const { env } = require("@budibase/backend-core")

env._set("SELF_HOSTED", "0")
env._set("MULTI_TENANCY", "1")
env._set("NODE_ENV", "jest")
env._set("JWT_SECRET", "test-jwtsecret")
env._set("MINIO_URL", "http://localhost")
env._set("MINIO_ACCESS_KEY", "test")
env._set("MINIO_SECRET_KEY", "test")
env._set("COUCH_DB_USERNAME", "budibase")
env._set("COUCH_DB_PASSWORD", "budibase")
