<script>
  import {
    Layout,
    Heading,
    Body,
    Divider,
    Button,
    Label,
    notifications,
  } from "@budibase/bbui"
  import { auth } from "stores/portal"
  import { onMount } from "svelte"
  import CopyInput from "components/common/inputs/CopyInput.svelte"

  let apiKey = null

  async function generateAPIKey() {
    try {
      apiKey = await auth.generateAPIKey()
      notifications.success("New API key generated")
    } catch (err) {
      notifications.error("Unable to generate new API key")
    }
    // need to return false to keep modal open
    return false
  }

  onMount(async () => {
    try {
      apiKey = await auth.fetchAPIKey()
    } catch (err) {
      notifications.error("Unable to fetch API key")
    }
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading size="M">API Key</Heading>
    <Body>Your API key to access the Budibase public API</Body>
  </Layout>
  <Divider />
  <div class="fields">
    <div class="field">
      <Label size="L">API key</Label>
      <CopyInput bind:value={apiKey} />
    </div>
  </div>
  <div>
    <Button newStyles secondary on:click={generateAPIKey}>Regenerate key</Button
    >
  </div>
</Layout>

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: center;
  }
</style>
