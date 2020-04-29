import { split, last, pipe } from "lodash/fp"

export const splitName = fullname => {
  const componentName = pipe(fullname, [split("/"), last])

  const libName = fullname.substring(
    0,
    fullname.length - componentName.length - 1
  )

  return { libName, componentName }
}
