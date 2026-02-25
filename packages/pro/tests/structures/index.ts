import { structures as coreStructures } from "@budibase/backend-core/tests"
import * as docs from "./documents"

const pkg = {
  ...coreStructures,
  docs: {
    ...coreStructures.docs,
    ...docs,
  },
}

export default pkg
