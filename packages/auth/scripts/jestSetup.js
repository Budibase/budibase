const env = require("../src/environment")

env._set("NODE_ENV", "jest")
env._set("JWT_SECRET", "test-jwtsecret")
env._set("LOG_LEVEL", "silent")
