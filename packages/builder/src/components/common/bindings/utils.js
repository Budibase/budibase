export function addToText(value, caretPos, binding) {
  let toAdd = binding.path
  if (!value.includes("{{") && !value.includes("}}")) {
    toAdd = `{{ ${binding.path} }}`
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
