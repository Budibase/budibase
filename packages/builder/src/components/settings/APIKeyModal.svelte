<script>
  import { _ } from "../../../lang/i18n"
  import { ModalContent, Body, notifications, CopyInput } from "@budibase/bbui"
  import { auth } from "stores/portal"
  import { onMount } from "svelte"

  let apiKey = null

  async function generateAPIKey() {
    try {
      apiKey = await auth.generateAPIKey()
      notifications.success($_("components.settings.APIKeyModal.New_API"))
    } catch (err) {
      notifications.error($_("components.settings.APIKeyModal.Unable"))
    }
    // need to return false to keep modal open
    return false
  }

  onMount(async () => {
    try {
      apiKey = await auth.fetchAPIKey()
    } catch (err) {
      notifications.error($_("components.settings.APIKeyModal.Unable_fetch"))
    }
  })
</script>

<ModalContent
  title={$_("components.settings.APIKeyModal.API_Key")}
  showSecondaryButton
  secondaryButtonText={$_("components.settings.APIKeyModal.Regenerate")}
  secondaryAction={generateAPIKey}
  showCancelButton={false}
  confirmText={$_("components.settings.APIKeyModal.Close")}
>
  <Body size="S">{$_("components.settings.APIKeyModal.Your_API")}:</Body>
  <CopyInput bind:value={apiKey} />
</ModalContent>
