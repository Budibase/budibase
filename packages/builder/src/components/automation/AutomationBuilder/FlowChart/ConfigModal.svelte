<script>
  import { automationStore } from "builderStore"

  import { ModalContent, Toggle } from "@budibase/bbui"

  $: rowControl = $automationStore.selectedAutomation.automation.rowControl
  async function toggleFieldControl(evt) {
    await automationStore.actions.toggleFieldControl(evt.detail)
    await automationStore.actions.save(
      $automationStore.selectedAutomation?.automation
    )
  }
</script>

<ModalContent
  title="Automation Configuration"
  confirmText="Test"
  showConfirmButton={false}
>
  <Toggle
    bind:value={rowControl}
    on:change={toggleFieldControl}
    text="Fine Grained Row Control"
  />
</ModalContent>
