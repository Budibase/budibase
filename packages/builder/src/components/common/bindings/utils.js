export function addToText(value, caretPos, binding) {
  binding = typeof binding === "string" ? binding : binding.path
  value = value == null ? "" : value
  if (!value.includes("{{") && !value.includes("}}")) {
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
