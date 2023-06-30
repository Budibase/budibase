import { derived, get, writable } from "svelte/store"
import { capitalise } from "helpers"
import { string } from "yup"

export const createValidatedNameStore = (name, isVisible) => {
  const nameStore = writable(name)
  const isActiveStore = writable(false)
  const errorStore = writable(null)

  const validate = async () => {
    if (!isVisible || !get(isActiveStore)) {
      return true
    }

    try {
      await string().required().validate(get(nameStore), { abortEarly: false })

      errorStore.set(null)

      return true
    } catch (error) {
      errorStore.set(capitalise(error.message))

      return false
    }
  }

  const updateValue = value => {
    nameStore.set(value)
    validate()
  }

  const markActive = () => {
    isActiveStore.set(true)
    validate()
  }

  const combined = derived(
    [nameStore, errorStore, isActiveStore],
    ([$nameStore, $errorStore, $isActiveStore]) => ({
      name: $nameStore,
      error: $errorStore,
      preventSubmit: $errorStore !== null && $isActiveStore,
    })
  )

  return {
    subscribe: combined.subscribe,
    updateValue,
    markActive,
    validate,
  }
}
