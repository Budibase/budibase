<script>
  import { ModalContent, Body, notifications } from "@budibase/bbui"
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
  title="Developer information"
  showConfirmButton={false}
  showSecondaryButton={true}
  secondaryButtonText="Re-generate key"
  secondaryAction={generateAPIKey}
>
  <Body size="S">
    You can find information about your developer account here, such as the API
    key used to access the Budibase API.
  </Body>
  <CopyInput bind:value={apiKey} label="API key" />
</ModalContent>
