import env from "../environment"
import { tmpdir } from "os"

env._set("SELF_HOSTED", "1")
env._set("NODE_ENV", "jest")
env._set("JWT_SECRET", "test-jwtsecret")
env._set("CLIENT_ID", "test-client-id")
env._set("BUDIBASE_DIR", tmpdir("budibase-unittests"))
env._set("LOG_LEVEL", "silent")
env._set("PORT", 0)
env._set("MINIO_URL", "http://localhost")
env._set("MINIO_ACCESS_KEY", "test")
env._set("MINIO_SECRET_KEY", "test")
