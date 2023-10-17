// init the licensing mock
import { mocks } from "@budibase/backend-core/tests"
import * as pro from "@budibase/pro"

export const initProMocks = () => {
  mocks.licenses.init(pro)

  // use unlimited license by default
  mocks.licenses.useUnlimited()
}
