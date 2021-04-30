export function addToText(value, caretPos, binding) {
  binding = typeof binding === "string" ? binding : binding.path
  let toAdd = binding
  if (!value.includes("{{") && !value.includes("}}")) {
    toAdd = `{{ ${binding} }}`
  }
  if (caretPos.start) {
    value =
      value.substring(0, caretPos.start) +
      toAdd +
      value.substring(caretPos.end, value.length)
  } else {
    value += toAdd
  }
  return value
}
