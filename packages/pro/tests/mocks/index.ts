import * as licenses from "./licenses"

import { mocks } from "@budibase/backend-core/tests"

// init licensing mock - be specific with our imports here,
// so we don't load the entire pro codebase into each test
import {
  CLOUD_FREE_LICENSE,
  UNLIMITED_LICENSE,
} from "../../src/constants/licenses"
import * as licensing from "../../src/sdk/licensing"

mocks.licenses.initInternal({
  CLOUD_FREE_LICENSE,
  UNLIMITED_LICENSE,
  getCachedLicense: licensing.cache.getCachedLicense,
})

const pkg = {
  ...mocks,
  licenses: {
    ...licenses,
    ...mocks.licenses,
  },
}

export default pkg
