<script>
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { auth } from "stores/portal"
  import { onMount } from "svelte"

  let apiKey = null
  let loaded = false

  async function generateAPIKey() {
    try {
      await auth.generateAPIKey()
      notifications.success("New API key generated.")
    } catch (err) {
      notifications.error("Unable to generate new API key")
    }
  }

  onMount(async () => {
    apiKey = auth.fetchAPIKey()
  })
</script>

{#if loaded}
  <ModalContent
    title="Developer information"
    showSecondaryButton
    secondaryButtonText="Re-generate key"
    secondaryButtonAction={generateAPIKey}
  >
    <Body size="S">
      You can find information about your developer account here, such as the
      API key used to access the Budibase API.
    </Body>
    <Input disabled bind:value={apiKey} label="API key" />
  </ModalContent>
{/if}
