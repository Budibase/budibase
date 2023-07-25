import * as email from "./email"
import { mocks } from "@budibase/backend-core/tests"

import * as _pro from "@budibase/pro"
const pro = jest.mocked(_pro, true)

export default {
  email,
  pro,
  ...mocks,
}
