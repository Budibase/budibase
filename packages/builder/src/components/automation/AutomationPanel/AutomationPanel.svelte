<script>
  import AutomationList from "./AutomationList.svelte"
  import CreateAutomationModal from "./CreateAutomationModal.svelte"
  import { Icon, Modal, Tabs, Tab } from "@budibase/bbui"

  export let modal
  export let webhookModal
</script>

<div class="nav">
  <Tabs selected="Automations">
    <Tab title="Automations">
      <AutomationList />
      <Modal bind:this={modal}>
        <CreateAutomationModal {webhookModal} />
      </Modal>
    </Tab>
  </Tabs>
  <div class="add-button">
    <Icon hoverable name="AddCircle" on:click={modal.show} />
  </div>
</div>

<style>
  .add-button {
    position: absolute;
    top: var(--spacing-l);
    right: var(--spacing-xl);
  }
  .nav {
    overflow-y: auto;
    background: var(--background);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    border-right: var(--border-light);
    padding-bottom: 60px;
  }
</style>
