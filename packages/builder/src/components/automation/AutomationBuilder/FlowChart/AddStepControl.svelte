<script>
  import { Icon, Modal } from "@budibase/bbui"
  import ActionModal from "components/automation/AutomationBuilder/FlowChart/ActionModal.svelte"

  export let lastStep
  export let blockIdx

  let actionModal
</script>

<Icon on:click={actionModal.show} hoverable name="AddCircle" size="L" />

<Modal bind:this={actionModal} width="30%">
  <ActionModal {lastStep} {blockIdx} />
</Modal>
