import { writable, derived } from "svelte/store"

// DEPRECATED - Use the yup based validators for future validation

export function createValidationStore(initialValue, ...validators) {
  let touched = false

  const value = writable(initialValue || "")
  const error = derived(value, $v => validate($v, validators))
  const touchedStore = derived(value, () => {
    if (!touched) {
      touched = true
      return false
    }
    return touched
  })

  return [value, error, touchedStore]
}

function validate(value, validators) {
  const failing = validators.find(v => v(value) !== true)

  return failing && failing(value)
}
