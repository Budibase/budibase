import { capitalise } from "helpers"
import { derived } from "svelte/store"

export const createValidatedConfigStore = (
  configStore,
  validationStore,
  integration
) => {
  return derived(
    [configStore, validationStore],
    ([$configStore, $validationStore]) => {
      return Object.entries(integration.datasource).map(([key, properties]) => {
        const getValue = () => {
          if (properties.type === "fieldGroup") {
            return Object.entries(properties.fields).map(
              ([fieldKey, fieldProperties]) => {
                return {
                  key: fieldKey,
                  name: capitalise(fieldProperties.display || fieldKey),
                  type: fieldProperties.type,
                  value: $configStore[fieldKey],
                }
              }
            )
          }

          return $configStore[key]
        }

        return {
          key,
          value: getValue(),
          error: $validationStore.errors[key],
          name: capitalise(properties.display || key),
          type: properties.type,
        }
      })
    }
  )
}
