<script>
  import { ModalContent, Label, Input, Select, Toggle } from "@budibase/bbui"
  import { ConfigMap, Providers } from "./constants"

  export let config = {
    active: false,
    isDefault: false,
  }

  export let saveHandler
  export let deleteHandler

  let validation

  $: {
    const { provider, defaultModel, name, apiKey } = config
    validation = provider && defaultModel && name && apiKey
  }
  $: canEditBaseUrl =
    config.provider && ConfigMap[config.provider].baseUrl === ""

  function prefillConfig(evt) {
    const provider = evt.detail
    // grab the preset config from the constants for that provider and fill it in
    if (ConfigMap[provider]) {
      config = {
        ...config,
        ...ConfigMap[provider],
        provider,
      }
    } else {
      config.provider = provider
    }
  }
</script>

<ModalContent
  confirmText={"Save"}
  cancelText={"Delete"}
  onConfirm={saveHandler}
  onCancel={deleteHandler}
  disabled={!validation}
  size="M"
  title="Custom AI Configuration"
>
  <div class="form-row">
    <Label size="M">Provider</Label>
    <Select
      placeholder={null}
      bind:value={config.provider}
      options={Object.keys(Providers)}
      on:change={prefillConfig}
    />
  </div>
  <div class="form-row">
    <Label size="M">Name</Label>
    <Input
      error={config.name === "Budibase AI" ? "Cannot use this name" : null}
      placeholder={"Enter a name"}
      bind:value={config.name}
    />
  </div>
  <div class="form-row">
    <Label size="M">Default Model</Label>
    {#if config.provider !== Providers.Custom.name}
      <Select
        placeholder={config.provider ? "Choose an option" : "Select a provider"}
        bind:value={config.defaultModel}
        options={config.provider ? Providers[config.provider].models : []}
      />
    {:else}
      <Input bind:value={config.defaultModel} />
    {/if}
  </div>
  <div class="form-row">
    <Label size="M">Base URL</Label>
    <Input
      disabled={!canEditBaseUrl}
      placeholder={"https://budibase.ai"}
      bind:value={config.baseUrl}
    />
  </div>
  <div class="form-row">
    <Label size="M">API Key</Label>
    <Input type="password" bind:value={config.apiKey} />
  </div>
  <div class="form-row">
    <Toggle text="Active" bind:value={config.active} />
    <Toggle text="Set as default" bind:value={config.isDefault} />
  </div>
</ModalContent>

<style>
  .form-row {
    display: grid;
    grid-gap: var(--spacing-s);
    align-items: center;
  }
</style>
