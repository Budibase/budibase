import { derived, writable, get } from "svelte/store"
import { getValidatorFields } from "./validation"
import { capitalise } from "@/helpers"
import { notifications } from "@budibase/bbui"
import { object } from "yup"
import { DatasourceFieldType, UIIntegration } from "@budibase/types"
import { processStringSync } from "@budibase/string-templates"

interface ValidatedConfigItem {
  key: string
  value: any
  error: string | null
  name: string
  placeholder: string | undefined
  type: DatasourceFieldType
  hidden: string | undefined
  config: any | undefined
}

interface ValidatedConfigStore {
  validatedConfig: ValidatedConfigItem[]
  config: Record<string, unknown>
  errors: Record<string, string>
  preventSubmit: boolean
}

export const createValidatedConfigStore = (
  integration: UIIntegration,
  config: Record<string, any>
) => {
  const configStore = writable(config)

  const allValidators = getValidatorFields(integration)
  const selectedValidatorsStore = writable<typeof allValidators>({})
  const errorsStore = writable<Record<string, string>>({})

  const validate = async () => {
    try {
      await object()
        .shape(get(selectedValidatorsStore))
        .validate(get(configStore), { abortEarly: false })

      errorsStore.set({})

      return true
    } catch (error: any) {
      // Yup error
      if (error.inner) {
        const errors: Record<string, string> = {}

        const inner: { path: string; message: string }[] = error.inner
        inner.forEach(innerError => {
          errors[innerError.path] = capitalise(innerError.message)
        })

        errorsStore.set(errors)
      } else {
        // Non-yup error
        notifications.error("Unexpected validation error")
      }

      return false
    }
  }

  const updateFieldValue = (key: string, value: any[]) => {
    configStore.update($configStore => {
      const newStore = { ...$configStore }

      if (integration.datasource?.[key]?.type === "fieldGroup") {
        value.forEach(field => {
          newStore[field.key] = field.value
        })
        if (
          !("config" in integration.datasource[key]) ||
          !integration.datasource[key].config?.nestedFields
        ) {
          value.forEach(field => {
            newStore[field.key] = field.value
          })
        } else {
          newStore[key] = value.reduce(
            (p, field) => ({
              ...p,
              [field.key]: field.value,
            }),
            {}
          )
        }
      } else {
        newStore[key] = value
      }

      return newStore
    })
    validate()
  }

  const markAllFieldsActive = () => {
    selectedValidatorsStore.update($validatorsStore => {
      const fields = get(combined).validatedConfig
      const config = get(configStore)
      for (const field of fields) {
        const { key } = field
        if (field.hidden && eval(processStringSync(field.hidden, config))) {
          delete $validatorsStore[key]
          continue
        }

        $validatorsStore[key] = allValidators[key]
      }
      selectedValidatorsStore.set(allValidators)
      return $validatorsStore
    })
    validate()
  }

  const markFieldActive = (key: string) => {
    selectedValidatorsStore.update($validatorsStore => ({
      ...$validatorsStore,
      [key]: allValidators[key],
    }))
    validate()
  }

  const combined = derived(
    [configStore, errorsStore, selectedValidatorsStore],
    ([
      $configStore,
      $errorsStore,
      $selectedValidatorsStore,
    ]): ValidatedConfigStore => {
      const validatedConfig: ValidatedConfigItem[] = []

      const allowedRestKeys = ["rejectUnauthorized", "downloadImages"]
      Object.entries(integration.datasource || {}).forEach(
        ([key, properties]) => {
          if (integration.name === "REST" && !allowedRestKeys.includes(key)) {
            return
          }

          if (properties.type === DatasourceFieldType.FIELD_GROUP) {
            for (const [key, val] of Object.entries(properties.fields || {})) {
              validatedConfig.push({
                key,
                value: $configStore[key],
                error: $errorsStore[key],
                name: capitalise(val.display || key),
                placeholder: val.placeholder,
                type: val.type,
                hidden: properties.hidden,
                config: (val as any).config,
              })
            }
          } else {
            validatedConfig.push({
              key,
              value: $configStore[key],
              error: $errorsStore[key],
              name: capitalise(properties.display || key),
              placeholder: properties.placeholder,
              type: properties.type,
              hidden: properties.hidden,
              config: (properties as any).config,
            })
          }
        }
      )

      const allFieldsActive =
        Object.keys($selectedValidatorsStore).length ===
        Object.keys(allValidators).length

      const hasErrors = Object.keys($errorsStore).length > 0

      return {
        validatedConfig,
        config: $configStore,
        errors: $errorsStore,
        preventSubmit: allFieldsActive && hasErrors,
      }
    }
  )

  return {
    subscribe: combined.subscribe,
    updateFieldValue,
    markAllFieldsActive,
    markFieldActive,
    validate,
  }
}
