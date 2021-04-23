<script>
  import AutomationList from "./AutomationList.svelte"
  import CreateAutomationModal from "./CreateAutomationModal.svelte"
  import { Icon, Modal, Tabs, Tab } from "@budibase/bbui"
  let modal
</script>

<div class="title">
  <Tabs selected="Automations">
    <Tab title="Automations">
      <div class="tab-content-padding">
        <AutomationList />
        <Modal bind:this={modal}>
          <CreateAutomationModal />
        </Modal>
      </div>
    </Tab>
  </Tabs>
  <div class="add-button">
    <Icon hoverable name="AddCircle" on:click={modal.show} />
  </div>
</div>

<style>
  .tab-content-padding {
    padding: 0 var(--spacing-xl);
  }
  .add-button {
    position: absolute;
    top: var(--spacing-l);
    right: var(--spacing-xl);
  }

  .title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
  }
</style>
