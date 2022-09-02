const email = require("./email")
import { mocks as coreMocks } from "@budibase/backend-core/tests"

export = {
  email,
  ...coreMocks,
}
