import { split, last } from "lodash/fp"

import { pipe } from "../../common/core"

export const splitName = fullname => {
  const componentName = pipe(fullname, [split("/"), last])

  const libName = fullname.substring(
    0,
    fullname.length - componentName.length - 1
  )

  return { libName, componentName }
}
