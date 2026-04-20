<script lang="ts">
  import { createEventDispatcher } from "svelte"

  import { Combobox, Select } from "@budibase/bbui"
  import { type AIConfigType, type LLMProvider } from "@budibase/types"

  interface Props {
    configType: AIConfigType
    provider: string | undefined
    model: string
    providers?: LLMProvider[]
    disabled?: boolean
  }

  interface ModelOption {
    label: string
    value: string
  }

  const dispatch = createEventDispatcher<{
    providerChange: string | undefined
    modelChange: string
  }>()

  let {
    configType,
    provider,
    model,
    providers,
    disabled = false,
  }: Props = $props()

  let providerPlaceholder = $derived(
    !providers
      ? "Loading providers..."
      : providers.length
        ? "Choose a provider"
        : "No providers available"
  )

  let providersMap = $derived(
    providers?.reduce<Record<string, LLMProvider>>((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
  )

  let selectedProvider = $derived(
    provider ? providersMap?.[provider] : undefined
  )

  let modelOptions = $derived.by(() => {
    const models = selectedProvider?.models?.[configType] || []
    const options = models.map<ModelOption>(item => ({
      label: item,
      value: item,
    }))

    if (model?.trim() && !models.includes(model)) {
      options.unshift({
        label: `${model} (custom)`,
        value: model,
      })
    }

    return options
  })

  let modelPlaceholder = $derived.by(() => {
    if (!provider?.trim()) {
      return "Choose a provider first"
    }
    if (!providers) {
      return "Loading models..."
    }
    return modelOptions.length ? "Select or type a model" : "Type a model"
  })

  function handleProviderChange(event: CustomEvent<string | undefined>) {
    const nextProvider = event.detail
    provider = nextProvider
    dispatch("providerChange", nextProvider)

    if (model) {
      model = ""
      dispatch("modelChange", "")
    }
  }

  function handleModelChange(event: CustomEvent<string | undefined>) {
    model = event.detail ?? ""
    dispatch("modelChange", model)
  }
</script>

<Select
  label="Provider"
  required
  value={provider}
  options={providers}
  getOptionValue={o => o.id}
  getOptionLabel={o => o.displayName}
  placeholder={providerPlaceholder}
  loading={!providers}
  autocomplete
  searchPlaceholder="Search providers"
  {disabled}
  on:change={handleProviderChange}
/>

<Combobox
  label="Model"
  value={model}
  options={modelOptions}
  getOptionValue={o => o.value}
  getOptionLabel={o => o.label}
  placeholder={modelPlaceholder}
  {disabled}
  on:change={handleModelChange}
/>
