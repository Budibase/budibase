<script lang="ts">
  import { ModalContent, Label, Input, Select } from "@budibase/bbui"
  import { ConfigMap, Providers, Models } from "./constants"
  import type { ProviderConfig } from "@budibase/types"

  export let config: ProviderConfig
  export let updateHandler: (_config: ProviderConfig) => void
  export let enableHandler: (_config: ProviderConfig) => void
  export let disableHandler: (_config: ProviderConfig) => void

  let validation: boolean
  let edited: boolean = false

  $: isEnabled = config.active && config.isDefault

  $: {
    const { provider, defaultModel, name, apiKey } = config
    validation = Boolean(provider && name && defaultModel && apiKey)
  }
  $: canEditBaseUrl =
    config.provider &&
    ConfigMap[config.provider as keyof typeof ConfigMap].baseUrl === ""

  function prefillConfig(evt: CustomEvent) {
    const provider = evt.detail
    // grab the preset config from the constants for that provider and fill it in
    if (ConfigMap[provider as keyof typeof ConfigMap]) {
      config = {
        ...config,
        ...ConfigMap[provider as keyof typeof ConfigMap],
        provider,
      }
      edited = true
    } else {
      config.provider = provider
      edited = true
    }
  }
</script>

<ModalContent
  cancelText={isEnabled ? "Disable" : "Update"}
  confirmText={isEnabled ? "Update" : "Enable"}
  onConfirm={isEnabled
    ? () => updateHandler(config)
    : () => enableHandler(config)}
  onCancel={isEnabled
    ? () => disableHandler(config)
    : () => updateHandler(config)}
  disabled={!(validation && edited)}
  size="M"
  title={`Set up ${config.name}`}
>
  <div class="form-row">
    <Label size="M">API Key</Label>
    <Input
      type="password"
      bind:value={config.apiKey}
      on:input={() => (edited = true)}
    />
  </div>
  <div class="form-row">
    <Label size="M">Base URL</Label>
    <Input
      disabled={!canEditBaseUrl}
      placeholder={"https://budibase.ai"}
      bind:value={config.baseUrl}
      on:input={() => (edited = true)}
    />
  </div>

  <div class="form-row">
    <Label size="M">Default Model</Label>
    <Select
      placeholder={config.provider ? "Choose an option" : "Select a provider"}
      bind:value={config.defaultModel}
      options={Models}
      on:change={() => (edited = true)}
    />
  </div>
</ModalContent>

<style>
  .form-row {
    display: grid;
    grid-gap: var(--spacing-s);
    align-items: center;
  }
</style>
