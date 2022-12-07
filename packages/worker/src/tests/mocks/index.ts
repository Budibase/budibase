const email = require("./email")
import { mocks as coreMocks } from "@budibase/backend-core/tests"
import { mocks as proMocks } from "@budibase/pro/tests"

export = {
  email,
  ...coreMocks,
  ...proMocks,
}
