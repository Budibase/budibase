export const CAPTURE_VAR_INSIDE_TEMPLATE = /{{([^}]+)}}/g

export function readableToRuntimeBinding(bindableProperties, textWithBindings) {
  // Find all instances of template strings
  const boundValues = textWithBindings.match(CAPTURE_VAR_INSIDE_TEMPLATE)

  let result = textWithBindings
  // Replace readableBindings with runtimeBindings
  boundValues &&
    boundValues.forEach(boundValue => {
      const binding = bindableProperties.find(({ readableBinding }) => {
        return boundValue === `{{ ${readableBinding} }}`
      })
      if (binding) {
        result = result.replace(boundValue, `{{ ${binding.runtimeBinding} }}`)
      }
    })
  return result
}

export function runtimeToReadableBinding(bindableProperties, textWithBindings) {
  let temp = textWithBindings
  const boundValues =
    (typeof textWithBindings === "string" &&
      textWithBindings.match(CAPTURE_VAR_INSIDE_TEMPLATE)) ||
    []

  // Replace runtimeBindings with readableBindings:
  boundValues.forEach(v => {
    const binding = bindableProperties.find(({ runtimeBinding }) => {
      return v === `{{ ${runtimeBinding} }}`
    })
    if (binding) {
      temp = temp.replace(v, `{{ ${binding.readableBinding} }}`)
    }
  })

  return temp
}
