import env from "../environment"
import { env as coreEnv } from "@budibase/backend-core"

env._set("SELF_HOSTED", "0")
env._set("NODE_ENV", "jest")
env._set("JWT_SECRET", "test-jwtsecret")
env._set("LOG_LEVEL", "silent")
env._set("MULTI_TENANCY", "1")
env._set("MINIO_URL", "http://localhost")
env._set("MINIO_ACCESS_KEY", "test")
env._set("MINIO_SECRET_KEY", "test")
env._set("PLATFORM_URL", "http://localhost:10000")
env._set("INTERNAL_API_KEY", "test")
env._set("DISABLE_ACCOUNT_PORTAL", "0")
coreEnv._set("COUCH_DB_USER", "budibase")
coreEnv._set("COUCH_DB_PASSWORD", "budibase")
