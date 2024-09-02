<script>
  import {
    ModalContent,
    Label,
    Input,
    Select,
    Toggle,
    Dropzone,
    Body,
    notifications,
  } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import { plugins } from "stores/portal"
  import { PluginSource } from "constants"

  const options = [
    "OpenAI",
    "Anthropic",
    "Together AI",
    "Azure Open AI",
    "Custom"
  ]

  let source = PluginSource.GITHUB
  let dynamicValues = {}

  let name
  let baseUrl
  let apiKey
  let active
  let isDefault

  let validation
</script>

<ModalContent
    confirmText={"Save"}
    onConfirm={() => {}}
    disabled={!validation}
    size="M"
    title="Custom AI Configuration"
>
  <div class="form-row">
    <Label size="M">Provider</Label>
    <Select
        placeholder={null}
        bind:value={source}
        options={options}
    />
  </div>
  <div class="form-row">
    <Label size="M">Model</Label>
    <Select
        placeholder={null}
        bind:value={source}
        options={Object.values(PluginSource)}
    />
  </div>
  <div class="form-row">
    <Label size="M">Name</Label>
    <Input placeholder={"Test 1"} bind:value={name} />
  </div>
  <div class="form-row">
    <Label size="M">Base URL</Label>
    <Input placeholder={"www.google.com"} bind:value={baseUrl} />
  </div>
  <div class="form-row">
    <Label size="M">API Key</Label>
    <Input bind:value={apiKey} />
  </div>
  <Toggle text="Active" bind:value={active} />
  <Toggle text="Set as default" bind:value={isDefault} />
</ModalContent>

<style>
    .form-row {
        display: grid;
        grid-gap: var(--spacing-s);
        align-items: center;
    }
</style>
