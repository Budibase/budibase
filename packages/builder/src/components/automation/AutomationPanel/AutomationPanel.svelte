<script>
  import AutomationList from "./AutomationList.svelte"
  import CreateAutomationModal from "./CreateAutomationModal.svelte"
  import { Modal, Button, Layout, Icon } from "@budibase/bbui"
  import Panel from "components/design/Panel.svelte"

  export let modal
  export let webhookModal
</script>

<Panel title="Automations" borderRight noHeaderBorder titleCSS={false}>
  <span class="panel-title-content" slot="panel-title-content">
    <div class="header">
      <div>Automations</div>
      <div on:click={modal.show} class="spacing">
        <Icon name="Add" />
      </div>
    </div>
  </span>
  <AutomationList />
</Panel>

<Modal bind:this={modal}>
  <CreateAutomationModal {webhookModal} />
</Modal>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }

  .spacing {
    margin-left: 130px;
  }
</style>
