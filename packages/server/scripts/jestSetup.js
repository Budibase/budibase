const { tmpdir } = require("os")
const env = require("../src/environment")

env._set("NODE_ENV", "jest")
env._set("JWT_SECRET", "test-jwtsecret")
env._set("CLIENT_ID", "test-client-id")
env._set("BUDIBASE_DIR", tmpdir("budibase-unittests"))
env._set("LOG_LEVEL", "silent")
