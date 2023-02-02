import env from "../environment"
import { tmpdir } from "os"

env._set("SELF_HOSTED", "1")
env._set("NODE_ENV", "jest")
env._set("MULTI_TENANCY", "1")
// @ts-ignore
env._set("BUDIBASE_DIR", tmpdir("budibase-unittests"))
env._set("LOG_LEVEL", "silent")
