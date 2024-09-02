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
  
  const defaultConfig = {
    active: false,
    isDefault: false,
  }

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
        ...ConfigMap[provider]
      }
    } else {
      aiConfig = {
        ...aiConfig,
        provider
      }
    }
  }

  async function saveConfig() {
    const config = {
      type: "ai",
      config: [
        // TODO: include the ones that are already there, or just handle this in the backend
        aiConfig,
      ]
    }
    try {
      const savedConfig = await API.saveConfig(config)
      aiConfig._rev = savedConfig._rev
      aiConfig._id = savedConfig._id
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
      bind:value={aiConfig.provider}
      options={providers}
      on:change={prefillConfig}
    />
  </div>
  <div class="form-row">
    <Label size="M">Default Model</Label>
    <Select
      placeholder={null}
      bind:value={aiConfig.defaultModel}
      options={models}
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
    <Input bind:value={aiConfig.apiKey}/>
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
