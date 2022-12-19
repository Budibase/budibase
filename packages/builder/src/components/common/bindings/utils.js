export function addHBSBinding(value, caretPos, binding) {
  binding = typeof binding === "string" ? binding : binding.path
  value = value == null ? "" : value

  const left = caretPos?.start ? value.substring(0, caretPos.start) : ""
  const right = caretPos?.end ? value.substring(caretPos.end) : ""
  if (!left.includes("{{") || !right.includes("}}")) {
    binding = `{{ ${binding} }}`
  }
  if (caretPos.start) {
    value =
      value.substring(0, caretPos.start) +
      binding +
      value.substring(caretPos.end, value.length)
  } else {
    value += binding
  }
  return value
}

export function addJSBinding(value, caretPos, binding, { helper } = {}) {
  binding = typeof binding === "string" ? binding : binding.path
  value = value == null ? "" : value
  if (!helper) {
    binding = `$("${binding}")`
  } else {
    binding = `helpers.${binding}()`
  }
  if (caretPos.start) {
    value =
      value.substring(0, caretPos.start) +
      binding +
      value.substring(caretPos.end, value.length)
  } else {
    value += binding
  }
  return value
}
