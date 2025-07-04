<script lang="ts">
  import { ModalContent, Label, Input, Select } from "@budibase/bbui"
  import { ConfigMap, Models } from "./constants"
  import type { ProviderConfig } from "@budibase/types"

  export let config: ProviderConfig
  export let updateHandler: (_config: ProviderConfig) => void
  export let enableHandler: (_config: ProviderConfig) => void
  export let disableHandler: (_config: ProviderConfig) => void

  let complete: boolean

  $: isEnabled = config.active && config.isDefault

  $: {
    const { provider, defaultModel, name, apiKey } = config
    complete = Boolean(provider && name && defaultModel && apiKey)
  }
  $: canEditBaseUrl =
    config.provider &&
    ConfigMap[config.provider as keyof typeof ConfigMap].baseUrl === ""

  $: placeholder =
    config.provider === "AzureOpenAI"
      ? "https://<name>.openai.azure.com/openai/deployments/<deployment>"
      : "https://budibase.ai"
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
  disabled={!complete}
  size="M"
  title={`Set up ${config.name}`}
>
  <div class="form-row">
    <Label size="M">API Key</Label>
    <Input type="password" bind:value={config.apiKey} />
  </div>
  <div class="form-row">
    <Label size="M">Base URL</Label>
    <Input
      disabled={!canEditBaseUrl}
      {placeholder}
      bind:value={config.baseUrl}
    />
  </div>

  {#if config.provider !== "AzureOpenAI"}
    <div class="form-row">
      <Label size="M">Default Model</Label>
      <Select
        placeholder={config.provider ? "Choose an option" : "Select a provider"}
        bind:value={config.defaultModel}
        options={Models}
      />
    </div>
  {/if}
</ModalContent>

<style>
  .form-row {
    display: grid;
    grid-gap: var(--spacing-s);
    align-items: center;
  }
</style>
