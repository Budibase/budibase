<script>
  import {
    ModalContent,
    Label,
    Input,
    Select,
    Toggle,
    Body,
    notifications,
  } from "@budibase/bbui"
  import { ConfigMap, Providers } from "./constants"
  import { API } from "api"

  export let defaultConfig = {
    active: false,
    isDefault: false,
  }

  export let saveHandler
  export let deleteHandler

  let aiConfig = defaultConfig
  let validation

  $: {
    const { provider, defaultModel, name, apiKey } = aiConfig
    validation = provider && defaultModel && name && apiKey
  }

  function prefillConfig(evt) {
    const provider = evt.detail
    // grab the preset config from the constants for that provider and fill it in
    if (ConfigMap[provider]) {
      aiConfig = {
        ...aiConfig,
        ...ConfigMap[provider],
        provider
      }
    } else {
      aiConfig.provider = provider
      // aiConfig = {
      //   ...aiConfig,
      //   provider
      // }
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
      bind:value={aiConfig.provider}
      options={Object.keys(Providers)}
      on:change={prefillConfig}
    />
  </div>
  <div class="form-row">
    <Label size="M">Default Model</Label>
    <Select
      placeholder={aiConfig.provider ? "Choose an option" : "Select a provider first"}
      bind:value={aiConfig.defaultModel}
      options={aiConfig.provider ? Providers[aiConfig.provider].models : []}
    />
  </div>
  <div class="form-row">
    <Label size="M">Name</Label>
    <Input placeholder={"Test 1"} bind:value={aiConfig.name}/>
  </div>
  <div class="form-row">
    <Label size="M">Base URL</Label>
    <Input placeholder={"www.google.com"} bind:value={aiConfig.baseUrl}/>
  </div>
  <div class="form-row">
    <Label size="M">API Key</Label>
    <Input type="password" bind:value={aiConfig.apiKey}/>
  </div>
  <Toggle text="Active" bind:value={aiConfig.active}/>
  <Toggle text="Set as default" bind:value={aiConfig.isDefault}/>
</ModalContent>

<style>
  .form-row {
    display: grid;
    grid-gap: var(--spacing-s);
    align-items: center;
  }
</style>
