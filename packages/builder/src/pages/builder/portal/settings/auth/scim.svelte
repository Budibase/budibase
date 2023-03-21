<script>
  import {
    Button,
    Heading,
    Label,
    notifications,
    Layout,
    Body,
    Toggle,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "api"

  const configType = "scim"

  $: scimEnabled = true

  async function saveConfig(config) {
    // Delete unsupported fields
    delete config.createdAt
    delete config.updatedAt
    return API.saveConfig(config)
  }

  async function saveSCIM() {
    try {
      await saveConfig({
        type: configType,
        enabled: scimEnabled,
      })
      notifications.success(`Settings saved`)
    } catch (e) {
      notifications.error(e.message)
      return
    }
  }

  onMount(async () => {
    try {
      const scimConfig = await API.getConfig(configType)
      scimEnabled = scimConfig?.enabled
    } catch (error) {
      console.error(error)
      notifications.error("Error fetching SCIM config")
    }
  })
</script>

<Layout gap="XS" noPadding>
  <div class="provider-title">
    <Heading size="S">SCIM</Heading>
  </div>
  <Body size="S">Sync users with your identity provider.</Body>
  <div class="form-row">
    <Label size="L">Activated</Label>
    <Toggle text="" bind:value={scimEnabled} />
  </div>
</Layout>

<div>
  <Button cta on:click={saveSCIM}>Save</Button>
</div>
