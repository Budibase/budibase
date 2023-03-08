<script>
  import { ModalContent } from "@budibase/bbui"
  import { Body, notifications } from "@budibase/bbui"
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

<ModalContent
  title="API Key"
  showSecondaryButton
  secondaryButtonText="Regenerate key"
  secondaryAction={generateAPIKey}
  showCancelButton={false}
  confirmText="Close"
>
  <Body size="S">Your API key for accessing the Budibase public API:</Body>
  <CopyInput bind:value={apiKey} />
</ModalContent>
