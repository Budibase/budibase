/**
 * Builds a style string from a style object.
 */
export const buildStyle = styles => {
  let str = ""
  Object.entries(styles).forEach(([style, value]) => {
    if (style && value) {
      str += `${style}: ${value}; `
    }
  })
  return str
}

/**
 * Extracts all valid props from a component definition that should be passed to
 * its actual component instance.
 * Valid props do not begin with an underscore.
 */
export const getValidProps = component => {
  let props = {}
  Object.entries(component)
    .filter(([name]) => !name.startsWith("_"))
    .forEach(([key, value]) => {
      props[key] = value
    })
  return props
}
