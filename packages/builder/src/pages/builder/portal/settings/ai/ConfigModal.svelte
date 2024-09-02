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
  import { ConfigMap } from "./constants"
  import { API } from "api"

  // TODO: Update these
  const providers = [
    "OpenAI",
    "Anthropic",
    "Together AI",
    "Azure Open AI",
    "Custom"
  ]

  const models = [
    "gpt4o-mini",
  ]

  let formValues = {}

  let validation

  $: {
    const { provider, model, name, apiKey } = formValues
    validation = provider && model && name && apiKey
  }

  function prefillConfig(evt) {
    const provider = evt.detail
    // grab the preset config from the constants for that provider and fill it in
    if (ConfigMap[provider]) {
      formValues = {
        ...formValues,
        ...ConfigMap[provider]
      }
    } else {
      formValues = {
        provider
      }
    }
  }

  async function saveConfig() {
    try {
      const savedConfig = await API.saveConfig(formValues)
      formValues._rev = savedConfig._rev
      formValues._id = savedConfig._id
      notifications.success(`Configuration saved`)
    } catch (error) {
      notifications.error(
        `Failed to save AI Configuration, reason: ${error?.message || "Unknown"}`
      )
    }
  }

  async function deleteConfig() {
    // Delete a configuration
    try {
      // await API.deleteConfig({
      //   id: smtpConfig._id,
      //   rev: smtpConfig._rev,
      // })
      notifications.success(`Deleted config`)
    } catch (error) {
      notifications.error(
        `Failed to clear email settings, reason: ${error?.message || "Unknown"}`
      )
    }
  }

</script>

<ModalContent
    confirmText={"Save"}
    cancelText={"Delete"}
    onConfirm={saveConfig}
    onCancel={deleteConfig}
    disabled={!validation}
    size="M"
    title="Custom AI Configuration"
>
  <div class="form-row">
    <Label size="M">Provider</Label>
    <Select
      placeholder={null}
      bind:value={formValues.provider}
      options={providers}
      on:change={prefillConfig}
    />
  </div>
  <div class="form-row">
    <Label size="M">Model</Label>
    <Select
      placeholder={null}
      bind:value={formValues.model}
      options={models}
    />
  </div>
  <div class="form-row">
    <Label size="M">Name</Label>
    <Input placeholder={"Test 1"} bind:value={formValues.name}/>
  </div>
  <div class="form-row">
    <Label size="M">Base URL</Label>
    <Input placeholder={"www.google.com"} bind:value={formValues.baseUrl}/>
  </div>
  <div class="form-row">
    <Label size="M">API Key</Label>
    <Input bind:value={formValues.apiKey}/>
  </div>
  <Toggle text="Active" bind:value={formValues.active}/>
  <Toggle text="Set as default" bind:value={formValues.isDefault}/>
</ModalContent>

<style>
  .form-row {
    display: grid;
    grid-gap: var(--spacing-s);
    align-items: center;
  }
</style>
